import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Row, Field, usePlans, CurrencySelector, CycleSelector } from 'react-components';
import PlanCard from './PlanCard/PlanCard';
import { PLANS, CURRENCIES, CYCLE } from 'proton-shared/lib/constants';
import { getPlan } from '../plans';

const PlanStep = ({ onSelect, model }) => {
    const [currency, setCurrency] = useState(model.currency);
    const [cycle, setCycle] = useState(model.cycle);
    const handleSelect = (planName) => () => onSelect({ ...model, planName, currency, cycle });

    const [plans] = usePlans();

    return (
        <>
            <Row className="flex-spacebetween">
                <Field>
                    <CycleSelector cycle={cycle} onSelect={setCycle} />
                </Field>
                <Field>
                    <CurrencySelector currency={currency} onSelect={setCurrency} />
                </Field>
            </Row>
            <div className="flex-autogrid">
                {[PLANS.FREE, PLANS.VPNBASIC, PLANS.VPNPLUS, PLANS.VISIONARY].map((planName) => (
                    <PlanCard
                        key={planName}
                        onSelect={handleSelect(planName)}
                        cycle={cycle}
                        currency={currency}
                        plan={getPlan(planName, cycle, plans)}
                        isActive={planName === model.planName}
                    />
                ))}
            </div>
        </>
    );
};

PlanStep.propTypes = {
    model: PropTypes.shape({
        planName: PropTypes.string.isRequired,
        cycle: PropTypes.oneOf([CYCLE.MONTHLY, CYCLE.TWO_YEARS, CYCLE.YEARLY]).isRequired,
        currency: PropTypes.oneOf(CURRENCIES).isRequired
    }).isRequired,
    onSelect: PropTypes.func.isRequired
};

export default PlanStep;
