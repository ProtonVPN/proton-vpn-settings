import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Wizard, Loader } from 'react-components';
import AccountStep from './AccountStep/AccountStep';
import PlanStep from './PlanStep/PlanStep';
import useSignup from './useSignup';
import { c } from 'ttag';
import VerificationStep from './VerificationStep/VerificationStep';
import PaymentStep from './PaymentStep/PaymentStep';
import SelectedPlan from './SelectedPlan';
import { PLAN } from './plans';

const SignupState = {
    Plan: 'plan',
    Account: 'account',
    Verification: 'verification',
    Payment: 'payment'
};

// TODO: back-forward buttons
// TODO: better handling of allowed methods (invite, coupon)
const SignupContainer = ({ history, onLogin }) => {
    const [signupState, setSignupState] = useState(SignupState.Plan);
    const handleLogin = (...rest) => {
        history.push('/dashboard');
        onLogin(...rest);
    };

    const historyState = history.location.state || {};
    const invite = historyState.invite;
    const coupon = historyState.coupon;

    const { model, setModel, signup, selectedPlan, checkPayment, signupAvailability, plans, isLoading } = useSignup(
        handleLogin,
        coupon
    );

    const handleSelectPlan = (model) => {
        setModel(model);
        setSignupState(SignupState.Account);
    };

    const handleCreateAccount = async (model) => {
        setModel(model);

        if (selectedPlan.price.total > 0) {
            setSignupState(SignupState.Payment);
        } else if (invite || coupon) {
            await signup(model, { invite, coupon });
        } else {
            setSignupState(SignupState.Verification);
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
                {isLoading ? (
                    <Loader />
                ) : (
                    <>
                        {signupState === SignupState.Plan && (
                            <PlanStep
                                plans={plans}
                                model={model}
                                onChangeCycle={(cycle) => setModel({ ...model, cycle })}
                                onChangeCurrency={(currency) => setModel({ ...model, currency })}
                                signupAvailability={signupAvailability}
                                onSelectPlan={handleSelectPlan}
                            />
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
            state: PropTypes.oneOfType([
                PropTypes.shape({
                    selector: PropTypes.string.isRequired,
                    token: PropTypes.string.isRequired
                }),
                PropTypes.shape({
                    Coupon: PropTypes.shape({ Code: PropTypes.string })
                })
            ])
        }).isRequired
    }).isRequired
};

export default SignupContainer;
