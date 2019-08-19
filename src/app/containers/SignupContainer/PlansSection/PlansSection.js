import React from 'react';
import { SubTitle, ButtonGroup, Group, Alert } from 'react-components';
import PropTypes from 'prop-types';
import { c } from 'ttag';
import PlanCard from './PlanCard';
import PlanCardHorizontal from './PlanCardHorizontal';
import { PLANS } from 'proton-shared/lib/constants';

const PlansSection = ({ selected, onSelect }) => {
    const handleSelect = (plan) => () => onSelect(plan);

    return (
        <>
            <SubTitle>{c('Title').t`1. Choose a plan that works for you`}</SubTitle>
            <Alert>Save 20% with anual subscription</Alert>
            <Group>
                <ButtonGroup>Monthly</ButtonGroup>
                <ButtonGroup disabled>Anually</ButtonGroup>
            </Group>
            <div>
                <div className="flex-autogrid">
                    <PlanCard
                        active={selected === PLANS.FREE}
                        onClick={handleSelect(PLANS.FREE)}
                        title={c('PlanTitle').t`Free`}
                        monthlyPrice={0}
                        discount={20}
                        description={c('Description').t`Free limited version`}
                        features={[c('Feature').t`Access to 3 countries`, c('Feature').t`1 device`]}
                        action={c('Action').t`Get Free`}
                    />
                    <PlanCard
                        active={selected === PLANS.VPNBASIC}
                        onClick={handleSelect(PLANS.VPNBASIC)}
                        title={c('PlanTitle').t`Basic`}
                        monthlyPrice={5}
                        discount={20}
                        description={c('Description').t`Basic privacy features`}
                        features={[
                            c('Feature').t`Access to all countries`,
                            c('Feature').t`2 devices`,
                            c('Feature').t`30-day money-back guarantee`
                        ]}
                        action={c('Action').t`Get Basic`}
                    />
                    <PlanCard
                        active={selected === PLANS.VPNPLUS}
                        onClick={handleSelect(PLANS.VPNPLUS)}
                        title={c('PlanTitle').t`Plus`}
                        monthlyPrice={10}
                        discount={20}
                        description={c('Description').t`The complete privacy suite`}
                        features={[
                            c('Feature').t`Access to all countries`,
                            c('Feature').t`5 devices`,
                            c('Feature').t`All advanced security features included`,
                            c('Feature').t`30-day money-back guarantee`
                        ]}
                        action={c('Action').t`Get Plus`}
                    />
                </div>
            </div>
            <PlanCardHorizontal
                active={selected === PLANS.VISIONARY}
                onClick={handleSelect(PLANS.VISIONARY)}
                title={c('PlanTitle').t`Visionary`}
                monthlyPrice={30}
                discount={20}
                description={c('Description').t`Plus 5 devices + ProtonMail Visionary plan`}
                action={c('Action').t`Get Visionary`}
            />
        </>
    );
};

PlansSection.propTypes = {
    selected: PropTypes.oneOf([PLANS.FREE, PLANS.VPNBASIC, PLANS.VPNPLUS, PLANS.VISIONARY]).isRequired,
    onSelect: PropTypes.func.isRequired
};

export default PlansSection;
