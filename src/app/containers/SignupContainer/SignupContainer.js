import React, { useState } from 'react';
import VpnLogo from 'react-components/components/logo/VpnLogo';
import { Wizard, ObserverSections } from 'react-components';
import PlansSection from './PlansSection/PlansSection';
import EmailSection from './EmailSection/EmailSection';
import PaymentDetailsSection from './PaymentDetailsSection/PaymentDetailsSection';
import SelectedPlan from './SelectedPlan/SelectedPlan';
import { PLANS } from 'proton-shared/lib/constants';
import { getPlan } from './plans';
import FreeSignupSection from './FreeSignupSection/FreeSignupSection';

// TODO: change step (Verification -> Payment) depending on plan
// TODO: step names translations
const SignupContainer = () => {
    const [plan, setPlan] = useState(PLANS.FREE);
    const [isAnnual, setIsAnnual] = useState(false);
    // If successfully convinced to purchase plus plan
    const [isNudgeSuccessful, setNudgeSuccessful] = useState(false);

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
            // TODO: go to #payment
        } else {
            // TODO: go to verification
        }
    };

    return (
        <>
            <header className="flex header color-white flex-items-center bg-black flex-spacebetween pt1 pb1 pl2 pr2">
                <VpnLogo />
                <div className="mw650p flex-item-fluid">
                    <Wizard steps={['Plan', 'Email', 'Verification', 'Finish']} />
                </div>
            </header>
            <main className="flex flex-item-fluid main-area">
                <div className="container-section-sticky">
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
                                    <EmailSection />
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
                                        <PaymentDetailsSection />
                                    </div>
                                )}
                            </div>
                            <SelectedPlan isAnnual={isAnnual} plan={getPlan(plan)} />
                        </div>
                    </ObserverSections>
                </div>
            </main>
        </>
    );
};

export default SignupContainer;
