import React from 'react';
import PropTypes from 'prop-types';
import {
    MainLogo,
    TopNavbar,
    Hamburger,
    BlackFridayNavbarLink,
    SubscriptionModal,
    usePlans,
    useModals,
    VPNBlackFridayModal,
    useSubscription
} from 'react-components';

const PrivateHeader = ({ location, expanded, onToggleExpand }) => {
    const [plans] = usePlans();
    const [subscription] = useSubscription();
    const { createModal } = useModals();

    const handleSelect = ({ planIDs = [], cycle, currency, couponCode }) => {
        const plansMap = planIDs.reduce((acc, planID) => {
            const { Name } = plans.find(({ ID }) => ID === planID);
            acc[Name] = 1;
            return acc;
        }, Object.create(null));

        createModal(
            <SubscriptionModal
                plansMap={plansMap}
                customize={false}
                subscription={subscription}
                cycle={cycle}
                currency={currency}
                coupon={couponCode}
            />
        );
    };

    const handleClick = () => {
        if (location.pathname === '/dashboard') {
            createModal(<VPNBlackFridayModal plans={plans} onSelect={handleSelect} />);
        }
    };

    return (
        <header className="header flex flex-nowrap reset4print">
            <MainLogo url="/account" className="nomobile" />
            <Hamburger expanded={expanded} onToggle={onToggleExpand} />
            <div className="searchbox-container nomobile" />
            <TopNavbar>
                <BlackFridayNavbarLink to="/dashboard" onClick={handleClick} />
            </TopNavbar>
        </header>
    );
};

PrivateHeader.propTypes = {
    expanded: PropTypes.boolean,
    onToggleExpand: PropTypes.func,
    location: PropTypes.shape({
        pathname: PropTypes.string
    })
};

export default PrivateHeader;
