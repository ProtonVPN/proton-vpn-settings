import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { c } from 'ttag';
import { PLAN, getPlan } from '../plans';
import { PrimaryButton, Price } from 'react-components';
import { CYCLE, CURRENCIES } from 'proton-shared/lib/constants';
import PriceInfo from './PriceInfo';

const upsellPlans = {
    [PLAN.FREE]: PLAN.BASIC,
    [PLAN.BASIC]: PLAN.PLUS
};

const PlanSummary = ({ selectedPlan, plans, cycle, currency, onExtendCycle, onUpgrade }) => {
    const [upsellDone, setUpsellDone] = useState(false);
    const { planName } = selectedPlan;
    const upsellPlanName = upsellPlans[planName];
    const upsellPlan = upsellPlanName && getPlan(upsellPlanName, cycle, plans);

    const handleExtendCycle = () => {
        setUpsellDone(true);
        onExtendCycle();
    };

    const handleUpgrade = (upsellPlanName) => () => {
        setUpsellDone(true);
        onUpgrade(upsellPlanName);
    };

    return (
        <div className="flex mt1 flex-column bordered-container">
            <h6 className="p0-5 mb0 w100 aligncenter bg-primary color-white">
                {planName === PLAN.FREE ? c('Title').t`Upgrade and get more` : c('Title').t`Summary`}
            </h6>
            <div className="p1">
                {planName !== PLAN.FREE && <PriceInfo plan={selectedPlan} cycle={cycle} currency={currency} />}
                {planName === PLAN.FREE && (
                    <ul className="selected-plan-list unstyled m0">
                        <li>{c('Free plan upsell').t`2 simultaneous VPN`}</li>
                        <li>{c('Free plan upsell').t`Access to 30+ countries`}</li>
                    </ul>
                )}

                {!upsellDone && cycle === CYCLE.MONTHLY && planName !== PLAN.FREE ? (
                    <PrimaryButton className="w100 mt1" onClick={handleExtendCycle}>{c('Action')
                        .t`Pay annually and save 20%`}</PrimaryButton>
                ) : (
                    upsellPlan &&
                    !upsellDone && (
                        <PrimaryButton className="w100 mt1" onClick={handleUpgrade(upsellPlanName)}>{c('Action')
                            .jt`Try ${upsellPlan.title} for only ${(
                            <Price currency={currency} suffix={c('Suffix').t`/ month`}>
                                {upsellPlan.price.totalMonthly}
                            </Price>
                        )}`}</PrimaryButton>
                    )
                )}
            </div>
        </div>
    );
};

PlanSummary.propTypes = {
    selectedPlan: PropTypes.object.isRequired,
    cycle: PropTypes.oneOf([CYCLE.MONTHLY, CYCLE.TWO_YEARS, CYCLE.YEARLY]).isRequired,
    currency: PropTypes.oneOf(CURRENCIES).isRequired,
    onExtendCycle: PropTypes.func.isRequired,
    onUpgrade: PropTypes.func.isRequired,
    plans: PropTypes.array.isRequired // TODO: better type
};

export default PlanSummary;
