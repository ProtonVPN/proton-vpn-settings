import React, { useState } from 'react';
import PropTypes from 'prop-types';
import VpnLogo from 'react-components/components/logo/VpnLogo';
import { Wizard, useApi, usePlans, useApiResult } from 'react-components';
import { PLANS, CYCLE } from 'proton-shared/lib/constants';
import VerificationStep from './VerificationStep/VerificationStep';
import AccountStep from './AccountStep/AccountStep';
import PlanStep from './PlanStep/PlanStep';
import { srpVerify, srpAuth } from 'proton-shared/lib/srp';
import { queryCreateUser, queryDirectSignupStatus } from 'proton-shared/lib/api/user';
import { auth, setCookies } from 'proton-shared/lib/api/auth';
import { getRandomString } from 'proton-shared/lib/helpers/string';
import { subscribe, setPaymentMethod } from 'proton-shared/lib/api/payments';
import { getPlan } from './PlanStep/plans';
import { handle3DS } from 'react-components/containers/payments/paymentTokenHelper';
import { mergeHeaders } from 'proton-shared/lib/fetch/helpers';
import { getAuthHeaders } from 'proton-shared/lib/api';

const SignupState = {
    Plan: 'plan',
    Verification: 'verification',
    Account: 'account',
    Thanks: 'thanks'
};

// TODO: move to hook
const singupAvailability = (Direct, VerifyMethods) => {
    const email = VerifyMethods.includes('email');
    const sms = VerifyMethods.includes('sms');
    const paid = VerifyMethods.includes('payment');
    const free = email || sms;

    return {
        signupAvailable: free || paid,
        email,
        free,
        sms,
        paid
    };
};

const withAuthHeaders = (UID, AccessToken, config) => mergeHeaders(config, getAuthHeaders(UID, AccessToken));

// TODO: step names translations
// TODO: payment code
const SignupContainer = ({ onLogin }) => {
    const api = useApi();
    // TODO: join to one model?
    const [planName, setPlanName] = useState(PLANS.FREE);
    const [currency, setCurrency] = useState();
    const [isAnnual, setIsAnnual] = useState();
    const [email, setEmail] = useState('');
    const [verificationToken, setVerificationToken] = useState();
    const [paymentDetails, setPaymentDetails] = useState();
    const [signupState, setSignupState] = useState(SignupState.Plan);

    // TODO: sequential loads?
    // TODO: handle plans loading
    const { loading: statusLoading, result: statusResult } = useApiResult(() => queryDirectSignupStatus(2), []);
    const [plans, plansLoading] = usePlans(currency);

    const plan = getPlan(planName, isAnnual, plans);
    const { Direct, VerifyMethods = [] } = statusResult || {};

    const allowedMethods = singupAvailability(Direct, VerifyMethods);

    if (statusResult && !allowedMethods.signupAvailable) {
        //TODO: redirect to invites
    }

    const handleConfirmPlan = (paymentDetails, isAnnual, currency) => {
        setCurrency(currency);
        setIsAnnual(isAnnual);
        if (paymentDetails) {
            setPaymentDetails(paymentDetails);
            setSignupState(SignupState.Account);
        } else {
            setSignupState(SignupState.Verification);
        }
    };

    const handleVerificationDone = (tokenData) => {
        setVerificationToken(tokenData);
        setSignupState(SignupState.Account);
    };

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
                Type: 2,
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
                    [plan.id]: 1
                },
                Amount: 0,
                Currency: currency,
                Cycle: isAnnual ? CYCLE.YEARLY : CYCLE.MONTHLY
                // CouponCode: MODEL.CouponCode || undefined // TODO this
            };
            await api(withAuthHeaders(UID, AccessToken, subscribe(subscription)));

            // Add payment method
            const { Payment } = await handle3DS(
                {
                    Amount: plan.price.total,
                    Currency: 'CHF',
                    ...paymentDetails.parameters
                },
                api
            );
            await api(withAuthHeaders(UID, AccessToken, setPaymentMethod(Payment)));
        }

        // set cookies after login
        await api(setCookies({ UID, AccessToken, RefreshToken, State: getRandomString(24) }));
        onLogin({ UID, EventID });

        setSignupState(SignupState.Thanks);
    };

    const step = planName ? (email ? (signupState === SignupState.Thanks ? 3 : 2) : 1) : 0;

    return (
        <>
            <header className="flex header color-white flex-items-center bg-black flex-spacebetween pt1 pb1 pl2 pr2">
                <VpnLogo />
                <div className="mw650p flex-item-fluid">
                    <Wizard
                        step={step}
                        steps={['Plan', 'Email', planName === PLANS.FREE ? 'Verification' : 'Payment', 'Finish']}
                    />
                </div>
            </header>
            <main className="flex flex-item-fluid main-area">
                <div className="container-section-sticky">
                    {statusResult && (
                        <>
                            {plans && signupState === SignupState.Plan && (
                                <PlanStep
                                    planName={planName}
                                    email={email}
                                    onConfirm={handleConfirmPlan}
                                    onSubmitEmail={setEmail}
                                    onChangePlan={setPlanName}
                                />
                            )}

                            {signupState === SignupState.Verification && (
                                <VerificationStep
                                    onVerificationDone={handleVerificationDone}
                                    email={email}
                                    onChangeEmail={setEmail}
                                    allowedMethods={allowedMethods}
                                />
                            )}

                            {signupState === SignupState.Account && <AccountStep onSubmit={handleSignup} />}
                        </>
                    )}
                </div>
            </main>
        </>
    );
};

SignupContainer.propTypes = {
    onLogin: PropTypes.func.isRequired
};

export default SignupContainer;
