import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Wizard, useUser } from 'react-components';
import { PLANS } from 'proton-shared/lib/constants';
import AccountStep from './AccountStep/AccountStep';
import PlanStep from './PlanStep/PlanStep';
import useSignup from './useSignup';
import { Redirect } from 'react-router-dom';
import { c } from 'ttag';
import VerificationStep from './VerificationStep/VerificationStep';
import PaymentStep from './PaymentStep/PaymentStep';
import { withRouter } from 'react-router-dom';
import SelectedPlan from './SelectedPlan';

const SignupState = {
    Plan: 'plan',
    Account: 'account',
    Verification: 'verification',
    Payment: 'payment'
};

const SignupContainer = ({ history, onLogin }) => {
    const [signupState, setSignupState] = useState(SignupState.Plan);
    const handleLogin = (...rest) => {
        history.push('/dashboard');
        onLogin(...rest);
    };
    const { model, setModel, signup, selectedPlan, checkPayment, signupAvailability, availablePlans } = useSignup(
        handleLogin
    );

    const invite = history.location.state;

    // TODO: handle signup loading
    if (signupAvailability && signupAvailability.inviteOnly) {
        return <Redirect to="/invite" />;
    }

    const step = signupState === SignupState.Plan ? 0 : signupState === SignupState.Account ? 1 : 2;

    const handleSelectPlan = (model) => {
        setModel(model);
        setSignupState(SignupState.Account);
    };

    const handleCreateAccount = (model) => {
        setModel(model);
        if (model.planName === PLANS.FREE) {
            if (invite) {
                signup(model, { invite });
            } else {
                setSignupState(SignupState.Verification);
            }
        } else {
            setSignupState(SignupState.Payment);
        }
    };

    const handleVerificationDone = (model, verificationToken) => {
        setModel(model);
        signup(model, { verificationToken });
    };

    const handlePaymentDone = async (model, paymentParameters) => {
        setModel(model);
        const paymentDetails = await checkPayment(model, paymentParameters);
        signup(model, { paymentDetails });
    };

    const selectedPlanComponent = <SelectedPlan plan={selectedPlan} currency={model.currency} cycle={model.cycle} />;

    // TODO: if invite token present && free, signup immediatelly after account (adjust steps accordingly)
    return (
        <>
            <Wizard
                step={step}
                steps={[
                    c('SignupStep').t`Select a subscription plan`,
                    c('SignupStep').t`Create an account`,
                    model.planName === PLANS.FREE
                        ? c('SignupStep').t`Verify your account`
                        : c('SignupStep').t`Provide payment details`
                ]}
            />
            <main className="flex flex-item-fluid main-area">
                <div className="container-section-sticky">
                    {signupAvailability && (
                        <>
                            {availablePlans && signupState === SignupState.Plan && (
                                <PlanStep model={model} onSelect={handleSelectPlan} />
                            )}

                            {signupState === SignupState.Account && (
                                <AccountStep model={model} onContinue={handleCreateAccount}>
                                    {selectedPlanComponent}
                                </AccountStep>
                            )}

                            {signupState === SignupState.Verification && (
                                <VerificationStep
                                    model={model}
                                    allowedMethods={signupAvailability.allowedMethods}
                                    onVerificationDone={handleVerificationDone}
                                >
                                    {selectedPlanComponent}
                                </VerificationStep>
                            )}

                            {signupState === SignupState.Payment && (
                                <PaymentStep
                                    model={model}
                                    paymentAmount={selectedPlan.price.total}
                                    onPaymentDone={handlePaymentDone}
                                >
                                    {selectedPlanComponent}
                                </PaymentStep>
                            )}
                        </>
                    )}
                </div>
            </main>
        </>
    );
};

SignupContainer.propTypes = {
    onLogin: PropTypes.func.isRequired,
    history: PropTypes.shape({
        push: PropTypes.func.isRequired,
        location: PropTypes.shape({
            state: PropTypes.shape({
                selector: PropTypes.string.isRequired,
                token: PropTypes.string.isRequired
            })
        }).isRequired
    }).isRequired
};

export default withRouter(SignupContainer);
