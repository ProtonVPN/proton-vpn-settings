import { useContext } from 'react';
import { SignupContext } from './SignupProvider';
import { srpVerify, srpAuth } from 'proton-shared/lib/srp';
import { useApi, usePlans, useConfig, useNotifications } from 'react-components';
import { queryCreateUser } from 'proton-shared/lib/api/user';
import { auth, setCookies } from 'proton-shared/lib/api/auth';
import { subscribe, setPaymentMethod, checkSubscription, verifyPayment } from 'proton-shared/lib/api/payments';
import { mergeHeaders } from 'proton-shared/lib/fetch/helpers';
import { getAuthHeaders } from 'proton-shared/lib/api';
import { getPlan } from './plans';
import { handle3DS } from 'react-components/containers/payments/paymentTokenHelper';
import { getRandomString, toPrice } from 'proton-shared/lib/helpers/string';
import { c } from 'ttag';
import { PLANS } from 'proton-shared/lib/constants';

const withAuthHeaders = (UID, AccessToken, config) => mergeHeaders(config, getAuthHeaders(UID, AccessToken));

const useSignup = () => {
    const api = useApi();
    const { createNotification } = useNotifications();
    const { CLIENT_TYPE } = useConfig();
    const [model, setModel, { onLogin, signupAvailability }] = useContext(SignupContext);
    const {
        planName,
        currency,
        cycle,
        email,
        verificationToken,
        paymentDetails,
        appliedCoupon,
        appliedGiftCode
    } = model;
    // TODO: move verificationToken from model to useVerification hook

    const updateModel = (partial) => setModel((model) => ({ ...model, ...partial }));

    // TODO: sequential loads?
    // TODO: handle plans loading
    const [plans, plansLoading] = usePlans(currency); // TODO: change available plans based on coupon code?

    const selectedPlan = getPlan(planName, cycle, appliedCoupon || appliedGiftCode, plans); // TODO: move plans.js closer to this file
    const isLoading = plansLoading || !signupAvailability;

    /**
     * Verifies if payment was done and saves payment details for signup
     * @param {*=} parameters payment parameters from usePayment
     */
    const checkPayment = async (parameters) => {
        const amount = selectedPlan.price.total;

        if (amount > 0 || appliedGiftCode) {
            const { VerifyCode } = await api(
                verifyPayment({
                    Amount: amount,
                    Currency: currency,
                    Credit: appliedGiftCode ? appliedGiftCode.Amount : undefined, // weird but works
                    GiftCode: appliedGiftCode.Coupon.Code,
                    ...parameters
                })
            );

            const paymentDetails = { VerifyCode, parameters };
            updateModel({ paymentDetails });
        }
    };

    // TODO: a lot of stuff is missing in these methods still
    const signup = async (username, password) => {
        const tokenData = appliedCoupon
            ? { Token: appliedCoupon.Coupon.Code, TokenType: 'coupon' }
            : paymentDetails
            ? { Token: paymentDetails.VerifyCode, TokenType: 'payment' }
            : verificationToken;

        await srpVerify({
            api,
            credentials: { password },
            config: queryCreateUser({
                ...tokenData,
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
        if (planName !== PLANS.FREE) {
            const subscription = {
                PlanIDs: {
                    [selectedPlan.id]: 1
                },
                Amount: 0,
                Currency: currency,
                Cycle: cycle,
                CouponCode: appliedCoupon ? appliedCoupon.Coupon.Code : undefined
            };
            await api(withAuthHeaders(UID, AccessToken, subscribe(subscription)));
        }

        // Add payment method
        if (paymentDetails) {
            const { Payment } = await handle3DS(
                {
                    Amount: selectedPlan.price.total,
                    Currency: currency,
                    ...paymentDetails.parameters
                },
                api
            );
            await api(withAuthHeaders(UID, AccessToken, setPaymentMethod(Payment)));
        }

        // set cookies after login
        await api(setCookies({ UID, AccessToken, RefreshToken, State: getRandomString(24) }));
        onLogin({ UID, EventID });
    };

    const applyCoupon = async (CouponCode) => {
        const appliedCoupon = await api(
            checkSubscription({
                PlanIDs: {
                    [selectedPlan.id]: 1
                },
                CouponCode,
                Currency: currency,
                Cycle: cycle
            })
        );
        if (appliedCoupon.Coupon) {
            updateModel({ appliedCoupon });
            createNotification({
                text: c('Notification').t`Coupon "${appliedCoupon.Coupon.Description}" has been applied successfully`
            });
        } else {
            createNotification({ text: c('Notification').t`Coupon is invalid or expired`, type: 'error' });
        }
    };

    const applyGiftCode = async (GiftCode) => {
        const gift = await api(
            checkSubscription({
                PlanIDs: {
                    [selectedPlan.id]: 1
                },
                GiftCode,
                Currency: currency,
                Cycle: cycle
            })
        );
        const discount = toPrice(gift.Gift, currency);
        updateModel({ appliedGiftCode: { ...gift, Coupon: { Code: GiftCode, Description: discount } } });
        createNotification({
            text: c('Notification').t`Gift code for ${discount} has been applied successfully`
        });
    };

    return {
        model,
        isLoading,
        selectedPlan,
        availablePlans: plans,
        signupAvailability,

        checkPayment,
        updateModel,
        signup,
        applyCoupon,
        applyGiftCode
    };
};

export default useSignup;
