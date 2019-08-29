import React, { useState } from 'react';
import PropTypes from 'prop-types';
import VpnLogo from 'react-components/components/logo/VpnLogo';
import { Wizard } from 'react-components';
import { PLANS } from 'proton-shared/lib/constants';
import VerificationStep from './VerificationStep/VerificationStep';
import AccountStep from './AccountStep/AccountStep';
import PlanStep from './PlanStep/PlanStep';
import useSignup from './useSignup';
import { withRouter } from 'react-router';
import { c } from 'ttag';

const SignupState = {
    Plan: 'plan',
    Verification: 'verification',
    Account: 'account',
    Thanks: 'thanks'
};

// TODO: step names translations
// TODO: payment code
const SignupContainer = ({ history }) => {
    const [signupState, setSignupState] = useState(SignupState.Plan);
    const {
        model: { planName, email, inviteToken },
        signup,
        signupAvailability,
        availablePlans
    } = useSignup();

    // TODO: handle signup loading
    if (signupAvailability && signupAvailability.inviteOnly) {
        history.push('/invite');
    }

    // setSignupState(SignupState.Thanks); // TODO: onLogin show thanks page

    const step = planName ? (email ? (signupState === SignupState.Thanks ? 3 : 2) : 1) : 0;

    return (
        <>
            <header className="flex header color-white flex-items-center bg-black flex-spacebetween pt1 pb1 pl2 pr2">
                <VpnLogo />
                <div className="mw650p flex-item-fluid">
                    <Wizard
                        step={step}
                        steps={[
                            c('SignupStep').t`Plan`,
                            c('SignupStep').t`Email`,
                            planName === PLANS.FREE ? c('SignupStep').t`Verification` : c('SignupStep').t`Payment`,
                            c('SignupStep').t`Finish`
                        ]}
                    />
                </div>
            </header>
            <main className="flex flex-item-fluid main-area">
                <div className="container-section-sticky">
                    {signupAvailability && (
                        <>
                            {availablePlans && signupState === SignupState.Plan && (
                                <PlanStep
                                    onConfirm={(isVerifiedThroughPayment) =>
                                        isVerifiedThroughPayment || inviteToken
                                            ? setSignupState(SignupState.Account)
                                            : setSignupState(SignupState.Verification)
                                    }
                                />
                            )}

                            {signupState === SignupState.Verification && (
                                <VerificationStep onVerificationDone={() => setSignupState(SignupState.Account)} />
                            )}

                            {signupState === SignupState.Account && <AccountStep onSubmit={signup} />}
                        </>
                    )}
                </div>
            </main>
        </>
    );
};

SignupContainer.propTypes = {
    history: PropTypes.object.isRequired
};

export default withRouter(SignupContainer);
