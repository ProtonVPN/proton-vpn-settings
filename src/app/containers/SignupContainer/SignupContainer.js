import React, { useState } from 'react';
import PropTypes from 'prop-types';
import VpnLogo from 'react-components/components/logo/VpnLogo';
import { Wizard, useApi } from 'react-components';
import { PLANS } from 'proton-shared/lib/constants';
import VerificationStep from './VerificationStep/VerificationStep';
import AccountStep from './AccountStep/AccountStep';
import PlanStep from './PlanStep/PlanStep';
import { srpVerify, srpAuth } from 'proton-shared/lib/srp';
import { queryCreateUser } from 'proton-shared/lib/api/user';
import { auth, setCookies } from 'proton-shared/lib/api/auth';
import { getRandomString } from 'proton-shared/lib/helpers/string';

const SignupState = {
    Plan: 'plan',
    Verification: 'verification',
    Account: 'account',
    Thanks: 'thanks'
};

// TODO: step names translations
// TODO: payment code
const SignupContainer = ({ onLogin }) => {
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

    const loginAfterSignup = async (username, password) => {
        const { UID, EventID, AccessToken, RefreshToken } = await srpAuth({
            api,
            credentials: { username, password },
            config: auth({ Username: username })
        });

        await api(setCookies({ UID, AccessToken, RefreshToken, State: getRandomString(24) }));
        onLogin({ UID, EventID });
    };

    const handleSignup = async (username, password) => {
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

        await loginAfterSignup(username, password);

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

SignupContainer.propTypes = {
    onLogin: PropTypes.func.isRequired
};

export default SignupContainer;
