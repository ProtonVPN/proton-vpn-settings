import React from 'react';
import VpnLogo from 'react-components/components/logo/VpnLogo';
import { Wizard } from 'react-components';
import PlansSection from './PlansSection/PlansSection';

const SignupContainer = () => {
    return (
        <>
            <div className="flex color-white flex-items-center bg-black flex-spacebetween pt1 pb1 pl2 pr2">
                <VpnLogo />
                <div className="mw650p flex-item-fluid">
                    <Wizard steps={['Plan', 'Email', 'Verification', 'Finish']} />
                </div>
            </div>
            <main className="flex-item-fluid main-area main-full">
                <div className="container-section-sticky">
                    <PlansSection />
                </div>
            </main>
        </>
    );
};

export default SignupContainer;
