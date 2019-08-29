import React from 'react';
import { SubTitle, Label, Toggle, Row, Field, usePlans } from 'react-components';
import PropTypes from 'prop-types';
import { c } from 'ttag';
import PlanCard from './PlanCard';
import PlanCardHorizontal from './PlanCardHorizontal';
import { PLANS, CYCLE } from 'proton-shared/lib/constants';
import { getPlan } from '../../plans';
import useSignup from '../../useSignup';

const PlansSection = ({ onSelect }) => {
    const {
        model: { cycle },
        updateModel
    } = useSignup();
    const handleSelect = (planName) => () => onSelect(planName);
    const handleChangeAnnual = () => updateModel({ cycle: cycle === CYCLE.MONTHLY ? CYCLE.YEARLY : CYCLE.MONTHLY });
    const [plans] = usePlans();

    return (
        <div className="mb2">
            <SubTitle>{c('Title').t`1. Choose a plan that works for you`}</SubTitle>
            <Row>
                <Label className="flex-item-centered-vert">{c('Label').t`Pay annually (save 20%)`}</Label>
                <Field>
                    <Toggle onChange={handleChangeAnnual} checked={cycle === CYCLE.YEARLY} />
                </Field>
            </Row>
            <div>
                <div className="flex-autogrid">
                    {[PLANS.FREE, PLANS.VPNBASIC, PLANS.VPNPLUS].map((planName) => (
                        <PlanCard
                            key={planName}
                            onClick={handleSelect(planName)}
                            plan={getPlan(planName, cycle, null, plans)}
                        />
                    ))}
                </div>
            </div>
            <PlanCardHorizontal
                onClick={handleSelect(PLANS.VISIONARY)}
                plan={getPlan(PLANS.VISIONARY, cycle, null, plans)}
            />
        </div>
    );
};

PlansSection.propTypes = {
    selected: PropTypes.oneOf([PLANS.FREE, PLANS.VPNBASIC, PLANS.VPNPLUS, PLANS.VISIONARY]).isRequired,
    onSelect: PropTypes.func.isRequired
};

export default PlansSection;
