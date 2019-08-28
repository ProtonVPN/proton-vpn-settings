import { useContext } from 'react';
import { SignupContext } from './SignupProvider';
import { srpVerify, srpAuth } from 'proton-shared/lib/srp';
import { useApi, usePlans, useConfig } from 'react-components';
import { queryCreateUser } from 'proton-shared/lib/api/user';
import { auth, setCookies } from 'proton-shared/lib/api/auth';
import { subscribe, setPaymentMethod, checkSubscription } from 'proton-shared/lib/api/payments';
import { mergeHeaders } from 'proton-shared/lib/fetch/helpers';
import { getAuthHeaders } from 'proton-shared/lib/api';
import { getPlan } from './plans';
import { handle3DS } from 'react-components/containers/payments/paymentTokenHelper';
import { getRandomString } from 'proton-shared/lib/helpers/string';

const withAuthHeaders = (UID, AccessToken, config) => mergeHeaders(config, getAuthHeaders(UID, AccessToken));

const useSignup = () => {
    const api = useApi();
    const { CLIENT_TYPE } = useConfig();
    const [model, setModel, { onLogin, signupAvailability }] = useContext(SignupContext);
    const { planName, currency, cycle, email, verificationToken, paymentDetails } = model;

    const updateModel = (partial) => setModel((model) => ({ ...model, ...partial }));

    // TODO: sequential loads?
    // TODO: handle plans loading
    const [plans, plansLoading] = usePlans(currency); // TODO: change available plans based on coupon code?

    const selectedPlan = getPlan(planName, cycle, plans); // TODO: move plans.js closer to this file
    const isLoading = plansLoading || !signupAvailability;

    // TODO: a lot of stuff is missing in these methods still
    const handleSignup = async (username, password) => {
        const tokenData = paymentDetails
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

        if (paymentDetails) {
            // Add subscription
            // Amount = 0 means - paid before subscription
            const subscription = {
                PlanIDs: {
                    [selectedPlan.id]: 1
                },
                Amount: 0,
                Currency: currency,
                Cycle: cycle
                // CouponCode: MODEL.CouponCode || undefined // TODO this
            };
            await api(withAuthHeaders(UID, AccessToken, subscribe(subscription)));

            // Add payment method
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
        const { Coupon } = await api(
            checkSubscription({
                PlanIDs: {
                    [selectedPlan.id]: 1
                },
                CouponCode,
                Currency: currency,
                Cycle: cycle
            })
        );
        updateModel({ appliedCoupon: Coupon });
    };

    return {
        model,
        isLoading,
        selectedPlan,
        availablePlans: plans,
        signupAvailability,

        updateModel,
        handleSignup,
        applyCoupon
    };
};

export default useSignup;
