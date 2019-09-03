import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Row, Field, usePlans, CurrencySelector, CycleSelector } from 'react-components';
import PlanCard from './PlanCard/PlanCard';
import { CURRENCIES, CYCLE } from 'proton-shared/lib/constants';
import { getPlan, PLAN } from '../plans';

const PlanStep = ({ onSelect, model, signupAvailability }) => {
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
                {[PLAN.FREE, PLAN.BASIC, PLAN.PLUS, PLAN.VISIONARY].map((planName) => {
                    const plan = getPlan(planName, cycle, plans);
                    return (
                        <PlanCard
                            key={planName}
                            onSelect={handleSelect(planName)}
                            cycle={cycle}
                            currency={currency}
                            plan={plan}
                            isActive={planName === model.planName}
                            isDisabled={plan.disabled || (!signupAvailability.paid && plan.price.monthly > 0)}
                        />
                    );
                })}
            </div>
        </>
    );
};

PlanStep.propTypes = {
    signupAvailability: PropTypes.shape({
        paid: PropTypes.bool
    }).isRequired,
    model: PropTypes.shape({
        planName: PropTypes.string.isRequired,
        cycle: PropTypes.oneOf([CYCLE.MONTHLY, CYCLE.TWO_YEARS, CYCLE.YEARLY]).isRequired,
        currency: PropTypes.oneOf(CURRENCIES).isRequired
    }).isRequired,
    onSelect: PropTypes.func.isRequired
};

export default PlanStep;
