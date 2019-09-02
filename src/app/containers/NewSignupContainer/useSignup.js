import { useContext } from 'react';
import { SignupContext } from './SignupProvider';
import { srpVerify, srpAuth } from 'proton-shared/lib/srp';
import { useApi, usePlans, useConfig } from 'react-components';
import { queryCreateUser } from 'proton-shared/lib/api/user';
import { auth, setCookies } from 'proton-shared/lib/api/auth';
import { subscribe, setPaymentMethod, verifyPayment } from 'proton-shared/lib/api/payments';
import { mergeHeaders } from 'proton-shared/lib/fetch/helpers';
import { getAuthHeaders } from 'proton-shared/lib/api';
import { getPlan } from './plans';
import { handle3DS } from 'react-components/containers/payments/paymentTokenHelper';
import { getRandomString } from 'proton-shared/lib/helpers/string';
import { PLANS } from 'proton-shared/lib/constants';

const withAuthHeaders = (UID, AccessToken, config) => mergeHeaders(config, getAuthHeaders(UID, AccessToken));

const useSignup = () => {
    const api = useApi();
    const { CLIENT_TYPE } = useConfig();
    const [model, setModel, { onLogin, signupAvailability }] = useContext(SignupContext);
    const { planName, currency, cycle, email, username, password } = model;

    const updateModel = (partial, onUpdate) => setModel((model) => ({ ...model, ...partial }), onUpdate);

    // TODO: sequential loads?
    // TODO: handle plans loading
    const [plans, plansLoading] = usePlans(currency); // TODO: change available plans based on coupon code?

    const selectedPlan = getPlan(planName, cycle, plans);
    const isLoading = plansLoading || !signupAvailability;

    /**
     * Verifies if payment was done and saves payment details for signup
     * @param {*=} parameters payment parameters from usePayment
     */
    const checkPayment = async (parameters) => {
        const amount = selectedPlan.price.total;

        if (amount > 0) {
            const { VerifyCode } = await api(
                verifyPayment({
                    Amount: amount,
                    Currency: currency,
                    ...parameters
                })
            );

            const paymentDetails = { VerifyCode, parameters };
            updateModel({ paymentDetails });
        }
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
    // TODO: invitation token
    const signup = async ({ appliedCoupon, invite, verificationToken, paymentDetails }) => {
        const { Token, TokenType } = getToken({ appliedCoupon, invite, verificationToken, paymentDetails });

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
        if (planName !== PLANS.FREE) {
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

    return {
        model,
        isLoading,
        selectedPlan,
        availablePlans: plans,
        signupAvailability,

        checkPayment,
        updateModel,
        signup,
        onLogin
    };
};

export default useSignup;
