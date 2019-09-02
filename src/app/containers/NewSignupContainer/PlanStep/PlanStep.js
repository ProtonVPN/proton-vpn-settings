import React from 'react';
import { Row, Field, usePlans, CurrencySelector, CycleSelector } from 'react-components';
import PropTypes from 'prop-types';
import PlanCard from './PlanCard/PlanCard';
import { PLANS } from 'proton-shared/lib/constants';
import { getPlan } from '../plans';
import useSignup from '../useSignup';

const PlanStep = ({ onSelect }) => {
    const {
        model: { cycle, currency },
        updateModel
    } = useSignup();
    const handleSelect = (planName) => () => {
        updateModel({ planName });
        onSelect(planName);
    };
    const handleChangeCycle = (cycle) => updateModel({ cycle });
    const handleChangeCurrency = (currency) => updateModel({ currency });
    const [plans] = usePlans();

    return (
        <>
            <Row className="flex-spacebetween">
                <Field>
                    <CycleSelector cycle={cycle} onSelect={handleChangeCycle} />
                </Field>
                <Field>
                    <CurrencySelector currency={currency} onSelect={handleChangeCurrency} />
                </Field>
            </Row>
            <div className="flex-autogrid">
                {[PLANS.FREE, PLANS.VPNBASIC, PLANS.VPNPLUS, PLANS.VISIONARY].map((planName) => (
                    <PlanCard key={planName} onSelect={handleSelect(planName)} plan={getPlan(planName, cycle, plans)} />
                ))}
            </div>
        </>
    );
};

PlanStep.propTypes = {
    onSelect: PropTypes.func.isRequired
};

export default PlanStep;
