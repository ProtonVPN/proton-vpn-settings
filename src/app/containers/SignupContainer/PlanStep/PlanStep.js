import React from 'react';
import PropTypes from 'prop-types';
import { Row, Field, CurrencySelector, CycleSelector, SubTitle, useModals, LinkButton } from 'react-components';
import PlanCard from './PlanCard/PlanCard';
import { CURRENCIES, CYCLE } from 'proton-shared/lib/constants';
import { c } from 'ttag';
import PlanComparisonModal from './PlanComparisonModal';
import OSIcon from './OSIcon';

const { MONTHLY, YEARLY, TWO_YEARS } = CYCLE;

const PlanStep = ({ plans, onSelectPlan, onChangeCurrency, onChangeCycle, model, signupAvailability }) => {
    const { createModal } = useModals();

    const handleSelect = (planName) => () => onSelectPlan({ ...model, planName });
    const handleComparisonClick = () =>
        createModal(<PlanComparisonModal defaultCycle={model.cycle} defaultCurrency={model.currency} />);

    const supportedOS = (
        <>
            <OSIcon os="android" />
            <OSIcon os="windows" />
            <OSIcon os="macos" />
            <OSIcon os="ios" />
            <OSIcon os="linux" />
        </>
    );

    return (
        <>
            <Row className="flex-items-vcenter border-top pt3">
                <div className="flex-item-fluid">
                    <SubTitle>{c('Title').t`Select a plan`}</SubTitle>
                </div>
                <div className="mlauto">
                    <Field className="mr1 auto">
                        <CycleSelector
                            cycle={model.cycle}
                            onSelect={onChangeCycle}
                            options={[
                                { text: c('Billing cycle option').t`Monthly`, value: MONTHLY },
                                { text: c('Billing cycle option').t`Annually SAVE 20%`, value: YEARLY },
                                { text: c('Billing cycle option').t`Two-year SAVE 33%`, value: TWO_YEARS }
                            ]}
                        />
                    </Field>
                    <Field className="auto">
                        <CurrencySelector currency={model.currency} onSelect={onChangeCurrency} />
                    </Field>
                </div>
            </Row>
            <div className="flex flex-nowrap">
                {plans.map((plan) => (
                    <PlanCard
                        key={plan.planName}
                        onSelect={handleSelect(plan.planName)}
                        cycle={model.cycle}
                        currency={model.currency}
                        plan={plan}
                        isActive={plan.planName === model.planName}
                        isDisabled={plan.disabled || (!signupAvailability.paid && plan.price.monthly > 0)}
                    />
                ))}
            </div>
            {model.cycle === CYCLE.YEARLY && (
                <strong className="mt2 bl big aligncenter color-primary">{c('Info')
                    .t`You are saving 20% with an annual plan`}</strong>
            )}
            {model.cycle === CYCLE.TWO_YEARS && (
                <strong className="mt2 bl big aligncenter color-primary">{c('Info')
                    .t`You are saving 33% with an two-year plan`}</strong>
            )}
            <div className="mt2">
                <LinkButton className="bl center" onClick={handleComparisonClick}>{c('Action')
                    .t`View full plan comparison`}</LinkButton>
            </div>
            <div className="mt2 aligncenter">
                <span>{c('Info').jt`All plans support: ${supportedOS}`}</span>
                <span className="ml2 mr2 bordered" />
                <span>{c('Info').t`30-days money back guarantee`}</span>
            </div>
        </>
    );
};

PlanStep.propTypes = {
    signupAvailability: PropTypes.shape({
        paid: PropTypes.bool
    }).isRequired,
    plans: PropTypes.arrayOf(PropTypes.object).isRequired,
    model: PropTypes.shape({
        planName: PropTypes.string.isRequired,
        cycle: PropTypes.oneOf([MONTHLY, TWO_YEARS, YEARLY]).isRequired,
        currency: PropTypes.oneOf(CURRENCIES).isRequired
    }).isRequired,
    onSelectPlan: PropTypes.func.isRequired,
    onChangeCycle: PropTypes.func.isRequired,
    onChangeCurrency: PropTypes.func.isRequired
};

export default PlanStep;
