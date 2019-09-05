import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { c } from 'ttag';
import { PLAN, getPlan } from '../plans';
import { PrimaryButton, Price } from 'react-components';
import { CYCLE, CURRENCIES } from 'proton-shared/lib/constants';

const PlanUpsell = ({ selectedPlan, plans, cycle, currency, onExtendCycle, onUpgrade }) => {
    const [upsellDone, setUpsellDone] = useState(false);
    const { planName, upsell } = selectedPlan;
    const upsellCycle = cycle === CYCLE.MONTHLY && planName !== PLAN.FREE;

    if (upsellDone || (!upsell && !upsellCycle)) {
        return null; // No upsell needed
    }

    const upsellPlan = upsell && getPlan(upsell.planName, cycle, plans);

    const handleExtendCycle = () => {
        setUpsellDone(true);
        onExtendCycle();
    };

    const handleUpgrade = () => () => {
        setUpsellDone(true);
        onUpgrade(upsell.planName);
    };

    return (
        <div className="flex mt1 flex-column bordered-container">
            <h6 className="p0-5 mb0 w100 aligncenter bg-primary color-white">
                {planName === PLAN.FREE ? c('Title').t`Upgrade and get more` : c('Title').t`Summary`}
            </h6>
            <div className="p1">
                {upsellCycle && (
                    <>
                        <div>KAINA</div>
                        <PrimaryButton className="w100 mt1" onClick={handleExtendCycle}>{c('Action')
                            .t`Pay annually and save 20%`}</PrimaryButton>
                    </>
                )}

                {upsell && !upsellCycle && (
                    <>
                        <ul className="selected-plan-list unstyled m0">
                            {upsell.features.map((feature, i) => (
                                <li key={i}>{feature}</li>
                            ))}
                        </ul>
                        <PrimaryButton className="w100 mt1" onClick={handleUpgrade()}>{c('Action').jt`Try ${
                            upsellPlan.title
                        } for only ${(
                            <Price currency={currency} suffix={c('Suffix').t`/ month`}>
                                {upsellPlan.price.totalMonthly}
                            </Price>
                        )}`}</PrimaryButton>
                    </>
                )}
            </div>
        </div>
    );
};

PlanUpsell.propTypes = {
    selectedPlan: PropTypes.object.isRequired,
    cycle: PropTypes.oneOf([CYCLE.MONTHLY, CYCLE.TWO_YEARS, CYCLE.YEARLY]).isRequired,
    currency: PropTypes.oneOf(CURRENCIES).isRequired,
    onExtendCycle: PropTypes.func.isRequired,
    onUpgrade: PropTypes.func.isRequired,
    plans: PropTypes.array.isRequired // TODO: better type
};

export default PlanUpsell;
