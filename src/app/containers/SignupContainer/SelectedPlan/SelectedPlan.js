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
        isBest: true,
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
    const selectedPlan = featureSets[plan];

    return (
        <div className="m1">
            <div className="flex flex-column bordered-container selected-plan">
                <h3 className="pt1 pb1 mb0 w100 aligncenter bg-pv-green-light color-white">
                    ProtonVPN {PLAN_NAMES[plan]}
                </h3>
                {selectedPlan.isBest && (
                    <strong className="bg-plus aligncenter small p1 m0">Congrats! You chose our BEST OFFER!</strong>
                )}
                <ul className="ml1 mr1">
                    {selectedPlan.features.map((feature, i) => (
                        <li key={i}>{feature}</li>
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
