import { useState, useEffect } from 'react';
import { handlePaymentToken } from 'react-components/containers/payments/paymentTokenHelper';
import { srpVerify, srpAuth } from 'proton-shared/lib/srp';
import { useApi, usePlans, useConfig, useApiResult, useModals } from 'react-components';
import { queryCreateUser, queryDirectSignupStatus } from 'proton-shared/lib/api/user';
import { auth, setCookies } from 'proton-shared/lib/api/auth';
import { subscribe, setPaymentMethod, verifyPayment, checkSubscription } from 'proton-shared/lib/api/payments';
import { mergeHeaders } from 'proton-shared/lib/fetch/helpers';
import { getAuthHeaders } from 'proton-shared/lib/api';
import { getRandomString } from 'proton-shared/lib/helpers/string';
import { DEFAULT_CURRENCY, CYCLE, PLAN_TYPES, TOKEN_TYPES, CURRENCIES } from 'proton-shared/lib/constants';
import { getPlan, PLAN, VPN_PLANS } from './plans';
import { merge } from 'proton-shared/lib/helpers/object';

const getSignupAvailability = (isDirectSignupEnabled, allowedMethods = []) => {
    const email = allowedMethods.includes(TOKEN_TYPES.EMAIL);
    const sms = allowedMethods.includes(TOKEN_TYPES.SMS);
    const paid = allowedMethods.includes(TOKEN_TYPES.PAYMENT);
    const free = email || sms;

    return {
        allowedMethods,
        inviteOnly: !isDirectSignupEnabled || (!free && !paid),
        email,
        free,
        sms,
        paid
    };
};

const withAuthHeaders = (UID, AccessToken, config) => mergeHeaders(config, getAuthHeaders(UID, AccessToken));

/**
 * @param {Function} onLogin
 * @param {{ plan, code, cycle }} coupon
 */
const useSignup = (onLogin, coupon, initialModel = {}) => {
    const api = useApi();
    const { createModal } = useModals();
    const { CLIENT_TYPE } = useConfig();
    const { result } = useApiResult(() => queryDirectSignupStatus(CLIENT_TYPE), []);
    const [plans] = usePlans();
    const [plansWithCoupons, setPlansWithCoupons] = useState();

    const defaultCurrency = plans && plans[0] ? plans[0].Currency : DEFAULT_CURRENCY;
    const defaultCycle = coupon ? coupon.cycle : CYCLE.YEARLY;
    const defaultPlan = coupon ? coupon.plan : PLAN.PLUS;
    const signupAvailability = result && getSignupAvailability(result.Direct, result.VerifyMethods);
    const isLoading = !plansWithCoupons || !signupAvailability;

    const [model, setModel] = useState({
        planName: Object.values(PLAN).includes(initialModel.planName) ? initialModel.planName : defaultPlan,
        cycle: Object.values(CYCLE).includes(initialModel.cycle) ? initialModel.cycle : defaultCycle,
        currency: CURRENCIES.includes(initialModel.currency) ? initialModel.currency : defaultCurrency,
        email: initialModel.email || '',
        username: initialModel.username || '',
        password: initialModel.password || ''
    });

    // Until we can query plans+coupons at once, we need to check each plan individually
    useEffect(() => {
        const applyCoupon = async () => {
            const vpnPlans = plans.filter(({ Name, Type }) => Type === PLAN_TYPES.PLAN && VPN_PLANS.includes(Name));
            const plansWithCoupons = await Promise.all(
                vpnPlans.map(async (plan) => {
                    const {
                        AmountDue,
                        CouponDiscount,
                        Coupon: { Description }
                    } = await api(
                        checkSubscription({
                            CouponCode: coupon.code,
                            Currency: model.currency,
                            Cycle: model.cycle,
                            PlanIDs: { [plan.ID]: 1 }
                        })
                    );
                    return {
                        ...plan,
                        AmountDue,
                        CouponDiscount,
                        CouponDescription: Description
                    };
                })
            );
            setPlansWithCoupons(plansWithCoupons);
        };

        if (plans) {
            if (coupon) {
                applyCoupon();
            } else {
                setPlansWithCoupons(plans);
            }
        }
    }, [plans, coupon, model.cycle, model.currency]);

    /**
     * Verifies if payment was done and saves payment details for signup
     * @param {*=} paymentParameters payment parameters from usePayment
     * @returns {Promise<{ VerifyCode, paymentParameters }>} - paymentDetails
     */
    const checkPayment = async (model, paymentParameters) => {
        const selectedPlan = getPlan(model.planName, model.cycle, plans);
        const amount = selectedPlan.price.total;

        if (amount > 0) {
            const { VerifyCode } = await api(
                verifyPayment({
                    Amount: amount,
                    Currency: model.currency,
                    ...paymentParameters
                })
            );

            return { VerifyCode, paymentParameters };
        }

        return null;
    };

    const getToken = ({ coupon, invite, verificationToken, paymentDetails }) => {
        if (invite) {
            return { Token: `${invite.selector}:${invite.token}`, TokenType: TOKEN_TYPES.INVITE };
        } else if (coupon) {
            return { Token: coupon.code, TokenType: TOKEN_TYPES.COUPON };
        } else if (paymentDetails) {
            return { Token: paymentDetails.VerifyCode, TokenType: TOKEN_TYPES.PAYMENT };
        }
        return verificationToken;
    };

    const signup = async (model, signupToken) => {
        const { Token, TokenType } = getToken(signupToken);
        const { planName, password, email, username, currency, cycle } = model;
        const selectedPlan = getPlan(planName, cycle, plans);

        await srpVerify({
            api,
            credentials: { password },
            config: queryCreateUser({
                Token,
                TokenType,
                Type: CLIENT_TYPE,
                Email: email,
                Username: username
            })
        });

        const { UID, EventID, AccessToken, RefreshToken } = await srpAuth({
            api,
            credentials: { username, password },
            config: auth({ Username: username })
        });

        // Add subscription
        // Amount = 0 means - paid before subscription
        if (planName !== PLAN.FREE) {
            const subscription = {
                PlanIDs: {
                    [selectedPlan.id]: 1
                },
                Amount: 0,
                Currency: currency,
                Cycle: cycle,
                CouponCode: signupToken.coupon ? Token : undefined
            };
            await api(withAuthHeaders(UID, AccessToken, subscribe(subscription)));
        }

        // Add payment method
        if (signupToken.paymentDetails) {
            const { Payment } = await handlePaymentToken({
                params: {
                    Amount: selectedPlan.price.total,
                    Currency: currency,
                    ...signupToken.paymentDetails.paymentParameters
                },
                api,
                createModal
            });
            await api(withAuthHeaders(UID, AccessToken, setPaymentMethod(Payment)));
        }

        // set cookies after login
        await api(setCookies({ UID, AccessToken, RefreshToken, State: getRandomString(24) }));
        onLogin({ UID, EventID });
    };

    return {
        model,
        isLoading,
        plans: plansWithCoupons,
        selectedPlan: getPlan(model.planName, model.cycle, plansWithCoupons || []),
        signupAvailability,

        checkPayment,
        setModel,
        signup
    };
};

export default useSignup;
