import React from 'react';
import PropTypes from 'prop-types';
import { c } from 'ttag';
import { Price } from 'react-components';

const PlanPrice = ({ plan, currency, isAnnual }) => {
    return (
        <div>
            <strong>{c('Plan price per month').jt`${(
                <Price currency={currency}>{plan.price.monthly}</Price>
            )} / mo`}</strong>
            <div>
                {isAnnual
                    ? c('Plan price info yearly').jt`Charging you ${(
                          <Price currency={currency}>{plan.price.total}</Price>
                      )} yearly`
                    : c('Plan price info monthly').jt`Charging you ${(
                          <Price currency={currency}>{plan.price.monthly}</Price>
                      )} monthly`}
                {plan.price.saved > 0 && (
                    <strong>{c('Plan price yearly savings').jt`save ${(
                        <Price currency={currency}>{plan.price.saved}</Price>
                    )}`}</strong>
                )}
            </div>
        </div>
    );
};

PlanPrice.propTypes = {
    currency: PropTypes.string.isRequired,
    isAnnual: PropTypes.bool.isRequired,
    plan: PropTypes.shape({
        price: PropTypes.shape({
            monthly: PropTypes.number,
            total: PropTypes.number,
            saved: PropTypes.number
        }).isRequired
    }).isRequired
};

export default PlanPrice;
