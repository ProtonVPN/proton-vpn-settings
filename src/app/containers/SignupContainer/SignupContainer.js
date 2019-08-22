import React, { useState } from 'react';
import VpnLogo from 'react-components/components/logo/VpnLogo';
import { Wizard, useApi } from 'react-components';
import { PLANS } from 'proton-shared/lib/constants';
import VerificationStep from './VerificationStep/VerificationStep';
import AccountStep from './AccountStep/AccountStep';
import PlanStep from './PlanStep/PlanStep';
import { srpVerify } from 'proton-shared/lib/srp';
import { queryCreateUser } from 'proton-shared/lib/api/user';

const SignupState = {
    Plan: 'plan',
    Verification: 'verification',
    Account: 'account',
    Thanks: 'thanks'
};

// TODO: step names translations
// TODO: payment code
const SignupContainer = () => {
    const api = useApi();
    const [plan, setPlan] = useState(PLANS.FREE);
    const [email, setEmail] = useState('');
    const [tokenData, setTokenData] = useState();
    const [paymentCode, setPaymentCode] = useState();
    const [signupState, setSignupState] = useState(SignupState.Plan);

    const handleVerificationDone = (tokenData) => {
        setTokenData(tokenData);
        setSignupState(SignupState.Account);
    };

    const handleSignup = async (username, password) => {
        const { User } = await srpVerify({
            api,
            credentials: { password },
            config: queryCreateUser({
                ...tokenData,
                Type: 2,
                Email: email,
                Username: username
            })
        });

        console.log(User);

        setSignupState(SignupState.Thanks);
    };

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
                            email={email}
                            onAddPaymentMethod={setPaymentCode}
                            onNextStep={() => setSignupState(SignupState.Verification)}
                            onSubmitEmail={setEmail}
                            onChangePlan={setPlan}
                        />
                    )}

                    {signupState === SignupState.Verification && (
                        <VerificationStep onVerificationDone={handleVerificationDone} email={email} />
                    )}

                    {signupState === SignupState.Account && <AccountStep onSubmit={handleSignup} />}
                </div>
            </main>
        </>
    );
};

export default SignupContainer;
