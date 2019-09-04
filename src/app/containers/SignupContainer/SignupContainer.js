import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Loader, Row, Button, Title } from 'react-components';
import AccountStep from './AccountStep/AccountStep';
import PlanStep from './PlanStep/PlanStep';
import useSignup from './useSignup';
import { c } from 'ttag';
import VerificationStep from './VerificationStep/VerificationStep';
import PaymentStep from './PaymentStep/PaymentStep';
import { PLAN } from './plans';
import SupportDropdown from '../../components/header/SupportDropdown';
import { CYCLE } from 'proton-shared/lib/constants';
import PlanDetails from './SelectedPlan/PlanDetails';
import PlanSummary from './SelectedPlan/PlanSummary';

// TODO: Flexible on these parameters:
// - URLs
// - plans

const SignupState = {
    Plan: 'plan',
    Account: 'account',
    Verification: 'verification',
    Payment: 'payment'
};

// TODO: better handling of allowed methods (invite, coupon)
const SignupContainer = ({ history, onLogin }) => {
    const searchParams = new URLSearchParams(history.location.search);
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
        coupon,
        {
            planName: searchParams.get('plan'),
            cycle: Number(searchParams.get('cycle')),
            currency: searchParams.get('currency')
        }
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

    const handleUpgrade = (planName) => {
        setModel({ ...model, planName });
        if (planName !== PLAN.FREE && signupState === SignupState.Verification) {
            setSignupState(SignupState.Payment);
        } else if (planName === PLAN.FREE && signupState === SignupState.Payment) {
            setSignupState(SignupState.Verification);
        }
    };

    const handleExtendCycle = () => setModel({ ...model, cycle: CYCLE.YEARLY });

    const selectedPlanComponent = (
        <div className="ml1 selected-plan">
            <PlanDetails selectedPlan={selectedPlan} />
            <PlanSummary
                selectedPlan={selectedPlan}
                plans={plans}
                onExtendCycle={handleExtendCycle}
                onUpgrade={handleUpgrade}
                cycle={model.cycle}
                currency={model.currency}
            />
        </div>
    );

    const prevStep = {
        [SignupState.Account]: SignupState.Plan,
        [SignupState.Payment]: SignupState.Account,
        [SignupState.Verification]: SignupState.Account
    }[signupState];

    const handleBackClick = () => {
        if (prevStep) {
            setSignupState(prevStep);
        } else {
            history.push('/');
        }
    };

    return (
        <main className="flex flex-item-fluid main-area">
            <div className="container-section-sticky">
                <Row className="flex-spacebetween">
                    <div>
                        <Button onClick={handleBackClick}>
                            {prevStep ? c('Action').t`Back` : c('Action').t`Homepage`}
                        </Button>
                    </div>
                    <Title>{c('Title').t`Sign up`}</Title>
                    <div>
                        <SupportDropdown content={c('Action').t`Need help`} />
                    </div>
                </Row>
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
            search: PropTypes.string.isRequired,
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
