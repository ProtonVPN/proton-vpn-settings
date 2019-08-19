import React, { useState } from 'react';
import VpnLogo from 'react-components/components/logo/VpnLogo';
import { Wizard, ObserverSections } from 'react-components';
import PlansSection from './PlansSection/PlansSection';
import EmailSection from './EmailSection/EmailSection';
import PaymentDetailsSection from './PaymentDetailsSection/PaymentDetailsSection';
import SelectedPlan from './SelectedPlan/SelectedPlan';
import { PLANS } from 'proton-shared/lib/constants';

// TODO: change prices when annual is selected
const SignupContainer = () => {
    const [plan, setPlan] = useState(PLANS.FREE);
    const [isAnnual, setIsAnnual] = useState(false);

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
                            onSelect={setPlan}
                            selected={plan}
                            id="plan"
                        />
                        <div className="flex" id="details">
                            <div className="flex-item-fluid">
                                <EmailSection />
                                <PaymentDetailsSection />
                            </div>
                            <SelectedPlan plan={plan} />
                        </div>
                    </ObserverSections>
                </div>
            </main>
        </>
    );
};

export default SignupContainer;
