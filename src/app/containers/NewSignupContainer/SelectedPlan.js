import React from 'react';
import PropTypes from 'prop-types';
import { c } from 'ttag';
import { Price } from 'react-components';
import { CYCLE, CURRENCIES } from 'proton-shared/lib/constants';

// TODO: two year plan
// TODO: coupon (also check for which plan)
const SelectedPlan = ({ plan, cycle, currency }) => {
    const planTitle = c('VPN plan title').t`ProtonVPN ${plan.title}`;
    // const discount = appliedCoupon && appliedCoupon.CouponDiscount;

    return (
        <div className="ml1">
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
                    {plan.price.monthly > 0 && (
                        <div className="flex flex-spacebetween">
                            <span className="mr0-25">{planTitle}:</span>
                            <strong>
                                <Price currency={currency}>{plan.price.monthly}</Price>
                            </strong>
                        </div>
                    )}
                    {/* {discount && (
                        <div className="flex flex-spacebetween">
                            <span className="mr0-25">{c('Label').t`Coupon discount:`}</span>
                            <strong>
                                <Price className="color-global-success" currency={currency}>
                                    {discount}
                                </Price>
                            </strong>
                        </div>
                    )} */}
                    <div className="flex flex-spacebetween">
                        <strong className="mr0-25">
                            {cycle === CYCLE.YEARLY ? c('Label').jt`Total (12 months):` : c('Label').jt`Total:`}
                        </strong>
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
