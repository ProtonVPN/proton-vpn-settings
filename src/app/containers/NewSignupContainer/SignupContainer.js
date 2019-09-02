import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Wizard } from 'react-components';
import AccountStep from './AccountStep/AccountStep';
import PlanStep from './PlanStep/PlanStep';
import useSignup from './useSignup';
import { Redirect } from 'react-router-dom';
import { c } from 'ttag';
import VerificationStep from './VerificationStep/VerificationStep';
import PaymentStep from './PaymentStep/PaymentStep';
import { withRouter } from 'react-router-dom';
import SelectedPlan from './SelectedPlan';
import { PLAN } from './plans';

const SignupState = {
    Plan: 'plan',
    Account: 'account',
    Verification: 'verification',
    Payment: 'payment'
};

// TODO: better handling of allowed methods (invite, coupon)
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

    const handleSelectPlan = (model) => {
        setModel(model);
        setSignupState(SignupState.Account);
    };

    const handleCreateAccount = async (model) => {
        setModel(model);
        if (model.planName === PLAN.FREE) {
            if (invite) {
                await signup(model, { invite });
            } else {
                setSignupState(SignupState.Verification);
            }
        } else {
            setSignupState(SignupState.Payment);
        }
    };

    const handleVerificationDone = async (model, verificationToken) => {
        setModel(model);
        await signup(model, { verificationToken });
    };

    const handlePaymentDone = async (model, paymentParameters) => {
        setModel(model);
        const paymentDetails = await checkPayment(model, paymentParameters);
        await signup(model, { paymentDetails });
    };

    const selectedPlanComponent = <SelectedPlan plan={selectedPlan} currency={model.currency} cycle={model.cycle} />;
    const step = signupState === SignupState.Plan ? 0 : signupState === SignupState.Account ? 1 : 2;
    const baseSteps = [c('SignupStep').t`Select a subscription plan`, c('SignupStep').t`Create an account`];
    const steps = invite
        ? baseSteps
        : baseSteps.concat(
              model.planName === PLAN.FREE
                  ? [c('SignupStep').t`Verify your account`]
                  : [c('SignupStep').t`Provide payment details`]
          );

    return (
        <main className="flex flex-item-fluid main-area">
            <div className="container-section-sticky">
                <Wizard step={step} steps={steps} />
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
