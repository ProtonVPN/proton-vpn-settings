import React from 'react';
import PropTypes from 'prop-types';
import { c } from 'ttag';
import { Price } from 'react-components';
import { CYCLE, CURRENCIES } from 'proton-shared/lib/constants';

// TODO: CTA buttons
const SelectedPlan = ({ plan, cycle, currency }) => {
    const planTitle = c('VPN plan title').t`ProtonVPN ${plan.title}`;

    const billingCycleI18n = {
        [CYCLE.MONTHLY]: {
            label: c('Label').t`1 month:`
        },
        [CYCLE.YEARLY]: {
            label: c('Label').t`12 months:`,
            discount: c('Label').t`Annual discount (20%)`
        },
        [CYCLE.TWO_YEARS]: {
            label: c('Label').t`24 months:`,
            discount: c('Label').t`Two-year discount (33%)`
        }
    };

    const billingCycle = billingCycleI18n[cycle];
    const discount = plan.couponDiscount || plan.price.saved;

    return (
        <div className="ml1">
            <div className="flex flex-column bordered-container selected-plan">
                <h3 className="pt1 pb1 mb0 w100 aligncenter bg-pv-green-light color-white">{planTitle}</h3>
                {plan.additionalFeatures && <div className="m1">{plan.additionalFeatures} +</div>}
                <ul className="ml1 mr1">
                    {plan.features.map((feature, i) => (
                        <li key={i}>{feature}</li>
                    ))}
                </ul>
                <hr />
                <div className="pb1 pl1 pr1">
                    {plan.price.monthly > 0 && (
                        <div className="flex flex-spacebetween">
                            <span className="mr0-25">{billingCycle.label}</span>
                            <strong>
                                <Price currency={currency}>{plan.price.monthly}</Price>
                            </strong>
                        </div>
                    )}
                    {(billingCycle.discount || plan.couponDiscount) && (
                        <div className="flex flex-spacebetween">
                            <span className="mr0-25">
                                {plan.couponDiscount ? plan.couponDescription : billingCycle.discount}:
                            </span>
                            <strong>
                                <Price className="color-global-success" currency={currency}>
                                    {discount}
                                </Price>
                            </strong>
                        </div>
                    )}
                    <div className="flex flex-spacebetween">
                        <strong className="mr0-25">{c('Label').jt`Total due:`}</strong>
                        <Price currency={currency}>{plan.price.total}</Price>
                    </div>
                </div>
            </div>
        </div>
    );
};

SelectedPlan.propTypes = {
    plan: PropTypes.object.isRequired, // TODO: better type
    cycle: PropTypes.oneOf([CYCLE.MONTHLY, CYCLE.TWO_YEARS, CYCLE.YEARLY]).isRequired,
    currency: PropTypes.oneOf(CURRENCIES).isRequired
};

export default SelectedPlan;
