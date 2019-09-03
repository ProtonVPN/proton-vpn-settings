import React from 'react';
import PropTypes from 'prop-types';
import { c } from 'ttag';
import { CYCLE, CURRENCIES } from 'proton-shared/lib/constants';
import PriceInfo from './PriceInfo';
import { PLAN } from '../plans';
import UpgradeCTA from './UpgradeCTA';

const SelectedPlan = ({ plan, cycle, currency, onUpgrade, onExtendCycle, basicPlan }) => {
    const planTitle = c('VPN plan title').t`ProtonVPN ${plan.title}`;

    return (
        <div className="ml1">
            <div className="flex flex-column bordered-container selected-plan">
                <h3 className="pt1 pb1 mb0 w100 aligncenter bg-pv-green-light color-white">{planTitle}</h3>
                <div className="p1 border-bottom">
                    {plan.additionalFeatures && (
                        <>
                            <div>{plan.additionalFeatures}</div>
                            <strong className="color-global-success">+</strong>
                        </>
                    )}
                    <ul className="unstyled m0">
                        {plan.features.map((feature, i) => (
                            <li key={i}>{feature}</li>
                        ))}
                    </ul>
                </div>
                <div className="p1">
                    {plan.planName === PLAN.FREE ? (
                        <UpgradeCTA currency={currency} basicPlan={basicPlan} onUpgrade={onUpgrade} />
                    ) : (
                        <PriceInfo onExtendCycle={onExtendCycle} plan={plan} cycle={cycle} currency={currency} />
                    )}
                </div>
            </div>
        </div>
    );
};

SelectedPlan.propTypes = {
    plan: PropTypes.object.isRequired, // TODO: better type
    basicPlan: PropTypes.object.isRequired,
    cycle: PropTypes.oneOf([CYCLE.MONTHLY, CYCLE.TWO_YEARS, CYCLE.YEARLY]).isRequired,
    currency: PropTypes.oneOf(CURRENCIES).isRequired,
    onUpgrade: PropTypes.func.isRequired,
    onExtendCycle: PropTypes.func.isRequired
};

export default SelectedPlan;
