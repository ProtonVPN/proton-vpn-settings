import React, { useState } from 'react';
import { SubTitle } from 'react-components';
import { c } from 'ttag';
import PlanCard from './PlanCard';

const PlansSection = () => {
    const [selected, select] = useState(0);

    const handleSelect = (i) => () => {
        select(i);
    };

    return (
        <>
            <SubTitle>{c('Title').t`Choose a plan that works for you`}</SubTitle>
            <div className="flex-autogrid">
                <PlanCard
                    active={selected === 0}
                    onClick={handleSelect(0)}
                    title={c('PlanTitle').t`Free`}
                    monthlyPrice={0}
                    discount={20}
                    description={c('Description').t`Free limited version`}
                    features={[c('Feature').t`Access to 3 countries`, c('Feature').t`1 device`]}
                    action={c('Action').t`Get Free`}
                />
                <PlanCard
                    active={selected === 1}
                    onClick={handleSelect(1)}
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
                    active={selected === 2}
                    onClick={handleSelect(2)}
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
        </>
    );
};

export default PlansSection;
