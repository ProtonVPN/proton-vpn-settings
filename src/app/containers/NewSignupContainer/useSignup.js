import { useState } from 'react';
import { srpVerify, srpAuth } from 'proton-shared/lib/srp';
import { useApi, usePlans, useConfig, useApiResult, useModals } from 'react-components';
import { queryCreateUser, queryDirectSignupStatus } from 'proton-shared/lib/api/user';
import { auth, setCookies } from 'proton-shared/lib/api/auth';
import { subscribe, setPaymentMethod, verifyPayment } from 'proton-shared/lib/api/payments';
import { mergeHeaders } from 'proton-shared/lib/fetch/helpers';
import { getAuthHeaders } from 'proton-shared/lib/api';
import { getPlan, PLAN } from './plans';
import { getRandomString } from 'proton-shared/lib/helpers/string';
import { DEFAULT_CURRENCY, CYCLE } from 'proton-shared/lib/constants';
import { handlePaymentToken } from 'react-components/containers/payments/paymentTokenHelper';

const getSignupAvailability = (isDirectSignupEnabled, allowedMethods = []) => {
    const email = allowedMethods.includes('email');
    const sms = allowedMethods.includes('sms');
    const paid = allowedMethods.includes('payment');
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

const useSignup = (onLogin) => {
    const api = useApi();
    const { createModal } = useModals();
    const { CLIENT_TYPE } = useConfig();
    const { result } = useApiResult(() => queryDirectSignupStatus(CLIENT_TYPE), []);
    const [plans = [], plansLoading] = usePlans();

    const defaultCurrency = plans[0] ? plans[0].Currency : DEFAULT_CURRENCY;
    const initialPlan = new URLSearchParams(location.search).get('plan') || PLAN.FREE;
    const signupAvailability = result && getSignupAvailability(result.Direct, result.VerifyMethods);
    const isLoading = plansLoading || !signupAvailability;

    const [model, setModel] = useState({
        planName: initialPlan,
        cycle: CYCLE.YEARLY,
        email: '',
        username: '',
        password: '',
        currency: defaultCurrency
    });

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

    const getToken = ({ appliedCoupon, invite, verificationToken, paymentDetails }) => {
        if (invite) {
            return { Token: `${invite.selector}:${invite.token}`, TokenType: 'invite' };
        } else if (appliedCoupon) {
            return { Token: appliedCoupon.Coupon.Code, TokenType: 'coupon' };
        } else if (paymentDetails) {
            return { Token: paymentDetails.VerifyCode, TokenType: 'payment' };
        }
        return verificationToken;
    };

    // TODO: appliedCoupon (and gift code?)
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
                Cycle: cycle
                // CouponCode: appliedCoupon ? appliedCoupon.Coupon.Code : undefined
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
        availablePlans: plans,
        selectedPlan: getPlan(model.planName, model.cycle, plans),
        signupAvailability,

        checkPayment,
        setModel,
        signup
    };
};

export default useSignup;
