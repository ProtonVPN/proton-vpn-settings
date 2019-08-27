import React, { useState } from 'react';
import PropTypes from 'prop-types';
import VpnLogo from 'react-components/components/logo/VpnLogo';
import { Wizard } from 'react-components';
import { PLANS } from 'proton-shared/lib/constants';
import VerificationStep from './VerificationStep/VerificationStep';
import AccountStep from './AccountStep/AccountStep';
import PlanStep from './PlanStep/PlanStep';
import useSignup from './useSignup';

const SignupState = {
    Plan: 'plan',
    Verification: 'verification',
    Account: 'account',
    Thanks: 'thanks'
};

// TODO: step names translations
// TODO: payment code
const SignupContainer = ({ onLogin, history }) => {
    const [signupState, setSignupState] = useState(SignupState.Plan);
    const {
        handleSignup,
        signupAvailability,
        model,
        updateModel,
        availablePlans,
        handleConfirmPlan,
        handleVerificationDone
    } = useSignup(onLogin);

    // TODO: handle signup loading
    if (signupAvailability && !signupAvailability.available) {
        history.push('/invite');
    }

    // setSignupState(SignupState.Thanks); // TODO: onLogin show thanks page

    const step = model.planName ? (model.email ? (signupState === SignupState.Thanks ? 3 : 2) : 1) : 0;

    return (
        <>
            <header className="flex header color-white flex-items-center bg-black flex-spacebetween pt1 pb1 pl2 pr2">
                <VpnLogo />
                <div className="mw650p flex-item-fluid">
                    <Wizard
                        step={step}
                        steps={['Plan', 'Email', model.planName === PLANS.FREE ? 'Verification' : 'Payment', 'Finish']}
                    />
                </div>
            </header>
            <main className="flex flex-item-fluid main-area">
                <div className="container-section-sticky">
                    {signupAvailability && (
                        <>
                            {availablePlans && signupState === SignupState.Plan && (
                                <PlanStep
                                    planName={model.planName}
                                    email={model.email}
                                    onConfirm={(paymentDetails, isAnnual, currency) => {
                                        handleConfirmPlan(paymentDetails, isAnnual, currency);
                                        if (paymentDetails) {
                                            setSignupState(SignupState.Account);
                                        } else {
                                            setSignupState(SignupState.Verification);
                                        }
                                    }}
                                    onSubmitEmail={(email) => updateModel({ email })}
                                    onChangePlan={(planName) => updateModel({ planName })}
                                />
                            )}

                            {signupState === SignupState.Verification && (
                                <VerificationStep
                                    onVerificationDone={(tokenData) => {
                                        handleVerificationDone(tokenData);
                                        setSignupState(SignupState.Account);
                                    }}
                                    email={model.email}
                                    onChangeEmail={(email) => updateModel({ email })}
                                    allowedMethods={signupAvailability}
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
    onLogin: PropTypes.func.isRequired,
    history: PropTypes.func.isRequired
};

export default SignupContainer;
