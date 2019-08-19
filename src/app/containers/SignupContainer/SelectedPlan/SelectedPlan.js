import React from 'react';
import PropTypes from 'prop-types';
import { PLANS, PLAN_NAMES } from 'proton-shared/lib/constants';

const featureSets = {
    [PLANS.FREE]: {
        features: [
            'Access to 3 countries',
            '1 device',
            'Free trial of Plus account for 7 days',
            'Multi-platform support'
        ]
    },
    [PLANS.VPNBASIC]: {
        features: [
            'Access to all countries',
            '2 devices',
            'High speeds',
            'Safe file sharing',
            'Multi-platform support',
            '30-day money-back guarantee'
        ]
    },
    [PLANS.VPNPLUS]: {
        features: [
            'Access to all countries',
            '5 devices',
            'Highest speeds',
            'Secure Core servers',
            'Safe file sharing',
            'Secure streaming',
            'Tor servers',
            'Multi-platform support',
            '30-day money-back guarantee'
        ]
    },
    [PLANS.VISIONARY]: {
        isBest: true,
        features: [
            'Access to all countries',
            '10 devices',
            'Highest speeds',
            'Secure Core servers',
            'Safe file sharing',
            'Secure streaming',
            'Tor servers',
            'ProtonMail Visionary included',
            'Multi-platform support',
            '30-day money-back guarantee'
        ]
    }
};

const SelectedPlan = ({ plan }) => {
    return (
        <div className="m1">
            <div className="flex selected-plan">
                <div>ProtonVPN {PLAN_NAMES[plan]}</div>
                <ul>
                    {featureSets[plan].features.map((feature) => (
                        <li>{feature}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

SelectedPlan.propTypes = {
    plan: PropTypes.oneOf([PLANS.FREE, PLANS.VPNBASIC, PLANS.VPNPLUS, PLANS.VISIONARY]).isRequired
};

export default SelectedPlan;
