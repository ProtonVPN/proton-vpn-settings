import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Wizard } from 'react-components';
import { PLANS } from 'proton-shared/lib/constants';
import AccountStep from './AccountStep/AccountStep';
import PlanStep from './PlanStep/PlanStep';
import useSignup from './useSignup';
import { Redirect } from 'react-router-dom';
import { c } from 'ttag';
import VerificationStep from './VerificationStep/VerificationStep';
import PaymentStep from './PaymentStep/PaymentStep';

const SignupState = {
    Plan: 'plan',
    Account: 'account',
    Verification: 'verification',
    Payment: 'payment'
};

const SignupContainer = ({ history }) => {
    const [signupState, setSignupState] = useState(SignupState.Plan);
    const {
        model: { planName },
        signup,
        signupAvailability,
        availablePlans
    } = useSignup();

    const invite = history.location.state;

    // TODO: handle signup loading
    if (signupAvailability && signupAvailability.inviteOnly) {
        return <Redirect to="/invite" />;
    }

    const step = signupState === SignupState.Plan ? 0 : signupState === SignupState.Account ? 1 : 2;

    const handleCreateAccount = () => {
        if (planName === PLANS.FREE) {
            if (invite) {
                console.log('Signup with invite');
            } else {
                setSignupState(SignupState.Verification);
            }
        } else {
            setSignupState(SignupState.Payment);
        }
    };

    const handleVerificationDone = (verificationToken) => {
        console.log('Signup free account with verification token');
    };

    const handlePaymentDone = () => {
        console.log('Signup paid account with paymentDetails');
    };

    // TODO: if invite token present && free, signup immediatelly after account (adjust steps accordingly)
    // TODO: signup
    return (
        <>
            <Wizard
                step={step}
                steps={[
                    c('SignupStep').t`Select a subscription plan`,
                    c('SignupStep').t`Create an account`,
                    planName === PLANS.FREE
                        ? c('SignupStep').t`Verify your account`
                        : c('SignupStep').t`Provide payment details`
                ]}
            />
            <main className="flex flex-item-fluid main-area">
                <div className="container-section-sticky">
                    {signupAvailability && (
                        <>
                            {availablePlans && signupState === SignupState.Plan && (
                                <PlanStep onSelect={() => setSignupState(SignupState.Account)} />
                            )}

                            {signupState === SignupState.Account && <AccountStep onContinue={handleCreateAccount} />}

                            {signupState === SignupState.Verification && (
                                <VerificationStep onVerificationDone={handleVerificationDone} />
                            )}

                            {signupState === SignupState.Payment && <PaymentStep onPaymentDone={handlePaymentDone} />}
                        </>
                    )}
                </div>
            </main>
        </>
    );
};

SignupContainer.propTypes = {
    history: PropTypes.shape({
        location: PropTypes.shape({
            state: PropTypes.shape({
                selector: PropTypes.string.isRequired,
                token: PropTypes.string.isRequired
            })
        }).isRequired
    }).isRequired
};

export default SignupContainer;
