import React from 'react';
import PropTypes from 'prop-types';
import { getPlanPrice } from '../plans';
import { c } from 'ttag';
import { Price } from 'react-components';

const PlanPrice = ({ plan, currency, isAnnual }) => {
    const { monthlyPrice, totalSaved } = getPlanPrice(plan, isAnnual);
    return (
        <div>
            <strong>{c('Plan price per month').jt`${<Price currency={currency}>{monthlyPrice}</Price>} / mo`}</strong>
            <div>
                {isAnnual
                    ? c('Plan price info yearly').jt`Charging you ${(
                          <Price currency={currency}>{monthlyPrice * 12}</Price>
                      )} yearly`
                    : c('Plan price info yearly').jt`Charging you ${(
                          <Price currency={currency}>{monthlyPrice}</Price>
                      )} monthly`}
                {totalSaved > 0 && (
                    <strong>{c('Plan price yearly savings').jt`save ${(
                        <Price currency={currency}>{totalSaved}</Price>
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
        monthlyPrice: PropTypes.number.isRequired
    })
};

export default PlanPrice;
