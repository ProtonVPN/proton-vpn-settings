import React from 'react';
import PropTypes from 'prop-types';
import { c } from 'ttag';
import { Price, Block } from 'react-components';
import { CYCLE, CURRENCIES } from 'proton-shared/lib/constants';

const PlanPrice = ({ plan, cycle, currency }) => {
    const discount = plan.couponDiscount || plan.price.saved;
    return (
        <div className="border-top pt1 plan-price">
            <Block>
                {c('PlanPrice').jt`${(
                    <strong>
                        <Price className="biggest" currency={currency}>
                            {plan.price.totalMonthly}
                        </Price>
                    </strong>
                )} / mo`}
            </Block>

            <div>
                {cycle === CYCLE.MONTHLY
                    ? c('PlanPrice').jt`Billed as ${(
                          <Price currency={currency} suffix={c('Suffix').t`monthly`}>
                              {plan.price.totalMonthly}
                          </Price>
                      )}`
                    : c('PlanPrice').jt`Billed as ${(
                          <Price
                              currency={currency}
                              suffix={cycle === CYCLE.TWO_YEARS ? c('Suffix').t`/2-year` : c('Suffix').t`/year`}
                          >
                              {plan.price.total}
                          </Price>
                      )}`}
                {discount > 0 && (
                    <strong className="ml0-25 color-primary">{c('PlanPrice').jt`SAVE ${(
                        <Price currency={currency}>{discount}</Price>
                    )}`}</strong>
                )}
            </div>
        </div>
    );
};

PlanPrice.propTypes = {
    cycle: PropTypes.oneOf([CYCLE.MONTHLY, CYCLE.TWO_YEARS, CYCLE.YEARLY]).isRequired,
    currency: PropTypes.oneOf(CURRENCIES).isRequired,
    plan: PropTypes.shape({
        couponDiscount: PropTypes.number,
        price: PropTypes.shape({
            totalMonthly: PropTypes.number,
            monthly: PropTypes.number,
            total: PropTypes.number,
            saved: PropTypes.number
        }).isRequired
    }).isRequired
};

export default PlanPrice;
