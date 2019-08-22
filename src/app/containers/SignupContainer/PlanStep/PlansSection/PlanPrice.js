import React from 'react';
import PropTypes from 'prop-types';
import { getPlanPrice } from '../plans';
import { c } from 'ttag';

const PlanPrice = ({ plan, isAnnual }) => {
    const { monthlyPrice, totalSaved } = getPlanPrice(plan, isAnnual);
    return (
        <div>
            <div>
                <sup>€</sup>
                <strong>{monthlyPrice}</strong>
                <span>{c('Plan price per month').t`/ mo`}</span>
            </div>
            <div>
                {isAnnual
                    ? c('Plan price info yearly').t`Charging you ${monthlyPrice * 12} € yearly`
                    : c('Plan price info yearly').t`Charging you ${monthlyPrice} € monthly`}
                {totalSaved > 0 && <strong>{c('Plan price yearly savings').t`save ${totalSaved} €`}</strong>}
            </div>
        </div>
    );
};

PlanPrice.propTypes = {
    isAnnual: PropTypes.bool.isRequired,
    plan: PropTypes.shape({
        monthlyPrice: PropTypes.number.isRequired
    })
};

export default PlanPrice;
