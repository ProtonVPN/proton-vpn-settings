import React from 'react';
import PropTypes from 'prop-types';
import { PLANS, PLAN_NAMES } from 'proton-shared/lib/constants';
import { getPlan, getPlanPrice } from '../plans';
import { c } from 'ttag';

const SelectedPlan = ({ plan, isAnnual }) => {
    const { monthlyPrice } = getPlanPrice(plan, isAnnual);
    const planTitle = c('VPN plan title').t`ProtonVPN ${plan.title}`;

    return (
        <div className="m1">
            <div className="flex flex-column bordered-container selected-plan">
                <h3 className="pt1 pb1 mb0 w100 aligncenter bg-pv-green-light color-white">{planTitle}</h3>
                {plan.isBest && (
                    <strong className="bg-plus aligncenter small p1 m0">{c('Info')
                        .t`Congrats! You chose our BEST OFFER!`}</strong>
                )}
                <ul className="ml1 mr1">
                    {plan.features.map((feature, i) => (
                        <li key={i}>{feature}</li>
                    ))}
                </ul>
                <hr />
                <div className="pb1 pl1 pr1">
                    {monthlyPrice > 0 && (
                        <div>
                            {planTitle}: {monthlyPrice} €
                        </div>
                    )}
                    <div>
                        {isAnnual
                            ? c('Plan price total').t`Total (12 months): ${monthlyPrice * 12} €`
                            : c('Plan price total').t`Total: ${monthlyPrice} €`}
                    </div>
                </div>
            </div>
        </div>
    );
};

SelectedPlan.propTypes = {
    isAnnual: PropTypes.bool.isRequired,
    plan: PropTypes.shape({
        title: PropTypes.string.isRequired,
        description: PropTypes.string,
        features: PropTypes.arrayOf(PropTypes.string),
        isBest: PropTypes.bool
    }).isRequired
};

export default SelectedPlan;
