import React from 'react';
import VpnLogo from 'react-components/components/logo/VpnLogo';
import { Wizard } from 'react-components';
import PlansSection from './PlansSection/PlansSection';
import EmailSection from './EmailSection/EmailSection';
import PaymentDetailsSection from './PaymentDetailsSection/PaymentDetailsSection';

const SignupContainer = () => {
    return (
        <>
            <header className="flex header color-white flex-items-center bg-black flex-spacebetween pt1 pb1 pl2 pr2">
                <VpnLogo />
                <div className="mw650p flex-item-fluid">
                    <Wizard steps={['Plan', 'Email', 'Verification', 'Finish']} />
                </div>
            </header>
            <main className="flex-item-fluid main-area">
                <div className="container-section-sticky">
                    <PlansSection />
                    <EmailSection />
                    <PaymentDetailsSection />
                </div>
            </main>
        </>
    );
};

export default SignupContainer;
