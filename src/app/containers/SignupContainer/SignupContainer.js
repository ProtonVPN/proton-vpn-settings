import React, { useState } from 'react';
import VpnLogo from 'react-components/components/logo/VpnLogo';
import { Wizard, ObserverSections } from 'react-components';
import PlansSection from './PlansSection/PlansSection';
import EmailSection from './EmailSection/EmailSection';
import PaymentDetailsSection from './PaymentDetailsSection/PaymentDetailsSection';
import SelectedPlan from './SelectedPlan/SelectedPlan';
import { PLANS, DEFAULT_CURRENCY } from 'proton-shared/lib/constants';
import { getPlan, getPlanPrice } from './plans';
import FreeSignupSection from './FreeSignupSection/FreeSignupSection';
import VerificationStep from './VerificationStep/VerificationStep';

// TODO: step names translations
const SignupContainer = () => {
    const [plan, setPlan] = useState(PLANS.FREE);
    const [isAnnual, setIsAnnual] = useState(false);
    const [currency, setCurrency] = useState(DEFAULT_CURRENCY);
    // If successfully convinced to purchase plus plan
    const [email, setEmail] = useState('');
    const [isNudgeSuccessful, setNudgeSuccessful] = useState(false);
    const [verifyingEmail, setVerifyingEmail] = useState(false);

    const handleChangePlan = (plan) => {
        if (plan === PLANS.FREE && isNudgeSuccessful) {
            setNudgeSuccessful(false);
        }
        setPlan(plan);
    };

    const handleUpgradeClick = () => {
        setPlan(PLANS.VPNPLUS);
        setNudgeSuccessful(true);
    };

    const handleContinueClick = () => {
        if (isNudgeSuccessful) {
            location.replace('/signup#payment');
        } else {
            setVerifyingEmail(true);
        }
    };

    const step = plan ? (email ? 2 : 1) : 0;
    const selectedPlan = getPlan(plan);
    const { totalPrice } = getPlanPrice(plan, isAnnual);

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
                    {verifyingEmail ? (
                        <VerificationStep email={email} />
                    ) : (
                        <ObserverSections>
                            <PlansSection
                                isAnnual={isAnnual}
                                onAnnualChange={setIsAnnual}
                                onSelect={handleChangePlan}
                                selected={plan}
                                id="plan"
                            />
                            <div className="flex" id="details">
                                <div className="flex-item-fluid">
                                    <div className="container-section-sticky-section" id="email">
                                        <EmailSection onEnterEmail={setEmail} />
                                        {(plan === PLANS.FREE || isNudgeSuccessful) && (
                                            <FreeSignupSection
                                                onContinue={handleContinueClick}
                                                onUpgrade={handleUpgradeClick}
                                                plusActive={isNudgeSuccessful}
                                            />
                                        )}
                                    </div>
                                    {plan !== PLANS.FREE && (
                                        <div className="container-section-sticky-section" id="payment">
                                            <PaymentDetailsSection onChangeCurrency={setCurrency} amount={totalPrice} />
                                        </div>
                                    )}
                                </div>
                                <SelectedPlan currency={currency} isAnnual={isAnnual} plan={selectedPlan} />
                            </div>
                        </ObserverSections>
                    )}
                </div>
            </main>
        </>
    );
};

export default SignupContainer;
