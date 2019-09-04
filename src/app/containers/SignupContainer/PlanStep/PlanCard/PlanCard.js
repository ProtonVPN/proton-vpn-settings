import React from 'react';
import PropTypes from 'prop-types';
import { classnames, Button, Tooltip } from 'react-components';
import { c } from 'ttag';
import PlanPrice from './PlanPrice';
import { CYCLE, CURRENCIES } from 'proton-shared/lib/constants';

const PlanCard = ({ plan, isActive, onSelect, cycle, currency, isDisabled }) => {
    const button = (
        <Button
            disabled={isDisabled}
            onClick={onSelect}
            className={classnames(['w100 mtauto', isActive && 'pm-button--primary'])}
        >
            {c('Plan Action').t`Get ${plan.title}`}
        </Button>
    );

    return (
        <div className="flex-autogrid-item flex flex-column">
            <div className="p1 flex flex-items-center">
                <strong className="biggest mt0 mb0">{plan.title}</strong>
                {plan.isBest && (
                    <strong className="ml1 mt0 mb0 pt0-25 pb0-25 pr0-5 pl0-5 bg-plus small">{c('PlanInfo')
                        .t`BEST OFFER`}</strong>
                )}
            </div>
            <div
                role="button"
                onClick={onSelect}
                className={classnames(['plan-card flex-column', isActive && 'plan-card--active'])}
            >
                <PlanPrice plan={plan} cycle={cycle} currency={currency} />
                {plan.description && (
                    <strong className={classnames(['border-top mt1 pt1 mb1 big', plan.isBest && 'color-primary'])}>
                        {plan.description}
                    </strong>
                )}
                {plan.additionalFeatures && (
                    <>
                        <div>{plan.additionalFeatures}</div>
                        <strong className="color-primary">+</strong>
                    </>
                )}
                {plan.features && (
                    <ul className="mt0 mb1 unstyled">
                        {plan.features.map((feature, i) => (
                            <li key={i}>{feature}</li>
                        ))}
                    </ul>
                )}
                {isDisabled ? (
                    <Tooltip title={c('Info').t`This plan is temporarily disabled`}>{button}</Tooltip>
                ) : (
                    button
                )}
            </div>
        </div>
    );
};

PlanCard.propTypes = {
    isActive: PropTypes.bool.isRequired,
    plan: PropTypes.shape({
        planName: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        description: PropTypes.string,
        additionalFeatures: PropTypes.string,
        features: PropTypes.arrayOf(PropTypes.string),
        highlights: PropTypes.arrayOf(PropTypes.string),
        isBest: PropTypes.bool
    }).isRequired,
    cycle: PropTypes.oneOf([CYCLE.MONTHLY, CYCLE.TWO_YEARS, CYCLE.YEARLY]).isRequired,
    currency: PropTypes.oneOf(CURRENCIES).isRequired,
    onSelect: PropTypes.func.isRequired,
    isDisabled: PropTypes.bool
};

export default PlanCard;
