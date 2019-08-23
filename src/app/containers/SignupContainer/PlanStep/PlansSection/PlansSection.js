import React from 'react';
import { SubTitle, Label, Toggle, Row, Field } from 'react-components';
import PropTypes from 'prop-types';
import { c } from 'ttag';
import PlanCard from './PlanCard';
import PlanCardHorizontal from './PlanCardHorizontal';
import { PLANS } from 'proton-shared/lib/constants';
import { getPlan } from '../plans';

const PlansSection = ({ selected, onSelect, onAnnualChange, currency, isAnnual = false }) => {
    const handleSelect = (plan) => () => onSelect(plan);
    const handleChangeAnnual = () => onAnnualChange(!isAnnual);

    return (
        <>
            <SubTitle>{c('Title').t`1. Choose a plan that works for you`}</SubTitle>
            <Row>
                <Label className="flex-item-centered-vert">{c('Label').t`Pay annually (save 20%)`}</Label>
                <Field>
                    <Toggle onChange={handleChangeAnnual} checked={isAnnual} />
                </Field>
            </Row>
            <div>
                <div className="flex-autogrid">
                    {[PLANS.FREE, PLANS.VPNBASIC, PLANS.VPNPLUS].map((planName) => (
                        <PlanCard
                            key={planName}
                            active={selected === planName}
                            onClick={handleSelect(planName)}
                            plan={getPlan(planName)}
                            currency={currency}
                            isAnnual={isAnnual}
                        />
                    ))}
                </div>
            </div>
            <PlanCardHorizontal
                active={selected === PLANS.VISIONARY}
                onClick={handleSelect(PLANS.VISIONARY)}
                plan={getPlan(PLANS.VISIONARY)}
                currency={currency}
                isAnnual={isAnnual}
            />
        </>
    );
};

PlansSection.propTypes = {
    isAnnual: PropTypes.bool,
    currency: PropTypes.string.isRequired,
    onAnnualChange: PropTypes.func.isRequired,
    selected: PropTypes.oneOf([PLANS.FREE, PLANS.VPNBASIC, PLANS.VPNPLUS, PLANS.VISIONARY]).isRequired,
    onSelect: PropTypes.func.isRequired
};

export default PlansSection;
