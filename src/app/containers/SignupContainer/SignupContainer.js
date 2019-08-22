import React, { useState } from 'react';
import VpnLogo from 'react-components/components/logo/VpnLogo';
import { Wizard } from 'react-components';
import { PLANS } from 'proton-shared/lib/constants';
import VerificationStep from './VerificationStep/VerificationStep';
import AccountStep from './AccountStep/AccountStep';
import PlanStep from './PlanStep/PlanStep';

const SignupState = {
    Plan: 'plan',
    Verification: 'verification',
    Account: 'account'
};

// TODO: step names translations
const SignupContainer = () => {
    const [plan, setPlan] = useState(PLANS.FREE);
    const [email, setEmail] = useState('');
    const [signupState, setSignupState] = useState(SignupState.Plan);

    const handleNextStep = (nextStep) => () => setSignupState(nextStep);

    const step = plan ? (email ? 2 : 1) : 0;

    return (
        <>
            <header className="flex header color-white flex-items-center bg-black flex-spacebetween pt1 pb1 pl2 pr2">
                <VpnLogo />
                <div className="mw650p flex-item-fluid">
                    <Wizard
                        step={step}
                        steps={['Plan', 'Email', plan === PLANS.FREE ? 'Verification' : 'Payment', 'Finish']}
                    />
                </div>
            </header>
            <main className="flex flex-item-fluid main-area">
                <div className="container-section-sticky">
                    {signupState === SignupState.Plan && (
                        <PlanStep
                            plan={plan}
                            onNextStep={handleNextStep(SignupState.Verification)}
                            onSubmitEmail={setEmail}
                            onChangePlan={setPlan}
                        />
                    )}

                    {signupState === SignupState.Verification && (
                        <VerificationStep onVerificationDone={handleNextStep(SignupState.Account)} email={email} />
                    )}

                    {signupState === SignupState.Account && <AccountStep />}
                </div>
            </main>
        </>
    );
};

export default SignupContainer;
