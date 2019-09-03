import React from 'react';
import PropTypes from 'prop-types';
import { CYCLE, CURRENCIES } from 'proton-shared/lib/constants';
import { c } from 'ttag';
import { Price, PrimaryButton } from 'react-components';

const PriceInfo = ({ plan, cycle, currency, onExtendCycle }) => {
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
        <>
            {plan.price.monthly > 0 && (
                <div className="flex flex-spacebetween">
                    <span className="mr0-25">{billingCycle.label}</span>
                    <strong>
                        <Price currency={currency}>{plan.price.monthly}</Price>
                    </strong>
                </div>
            )}
            {(plan.couponDiscount || billingCycle.discount) && (
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
                <strong className="mr0-25">{c('Label').t`Total due:`}</strong>
                <Price currency={currency}>{plan.price.total}</Price>
            </div>
            {cycle === CYCLE.MONTHLY && (
                <div className="mt1">
                    <PrimaryButton className="w100" onClick={onExtendCycle}>{c('Action')
                        .t`Pay annually and save 20%`}</PrimaryButton>
                </div>
            )}
        </>
    );
};

PriceInfo.propTypes = {
    plan: PropTypes.object.isRequired, // TODO: better type
    cycle: PropTypes.oneOf([CYCLE.MONTHLY, CYCLE.TWO_YEARS, CYCLE.YEARLY]).isRequired,
    currency: PropTypes.oneOf(CURRENCIES).isRequired,
    onExtendCycle: PropTypes.isRequired
};

export default PriceInfo;
