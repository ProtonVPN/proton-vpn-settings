import React from 'react';
import PropTypes from 'prop-types';
import { classnames, Button } from 'react-components';
import { c } from 'ttag';
import PlanPrice from './PlanPrice';
import { CYCLE, CURRENCIES } from 'proton-shared/lib/constants';

const PlanCard = ({ plan, isActive, onSelect, cycle, currency }) => {
    return (
        <div className="flex-autogrid-item flex flex-column">
            <div className="p1 flex flex-items-center">
                <strong className="biggest mt0 mb0">{plan.title}</strong>
                {plan.isBest && (
                    <strong className="ml1 mt0 mb0 pt0-25 pb0-25 pr0-5 pl0-5 bg-plus small">BEST OFFER</strong>
                )}
            </div>
            <div
                role="button"
                onClick={onSelect}
                className={classnames(['plan-card flex-column', isActive && 'plan-card--active'])}
            >
                <PlanPrice plan={plan} cycle={cycle} currency={currency} />
                {plan.description && <div className="border-bottom">{plan.description}</div>}
                {plan.highlights && (
                    <ul>
                        {plan.highlights.map((feature, i) => (
                            <li key={i}>{feature}</li>
                        ))}
                    </ul>
                )}
                <Button onClick={onSelect} className={classnames(['w100 mtauto', isActive && 'pm-button--primary'])}>
                    {c('Plan Action').t`Get ${plan.title}`}
                </Button>
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
        features: PropTypes.arrayOf(PropTypes.string),
        highlights: PropTypes.arrayOf(PropTypes.string),
        isBest: PropTypes.bool
    }).isRequired,
    cycle: PropTypes.oneOf([CYCLE.MONTHLY, CYCLE.TWO_YEARS, CYCLE.YEARLY]).isRequired,
    currency: PropTypes.oneOf(CURRENCIES).isRequired,
    onSelect: PropTypes.func.isRequired
};

export default PlanCard;
