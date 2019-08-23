import React from 'react';
import PropTypes from 'prop-types';
import { classnames, Button } from 'react-components';
import { c } from 'ttag';
import PlanPrice from './PlanPrice';

const PlanCard = ({ active, plan, currency, isAnnual, onClick }) => {
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
                onClick={onClick}
                className={classnames(['plan-card flex-column', active && 'plan-card--active'])}
            >
                <PlanPrice plan={plan} isAnnual={isAnnual} currency={currency} />
                {plan.description && <div className="border-bottom">{plan.description}</div>}
                {plan.highlights && (
                    <ul>
                        {plan.highlights.map((feature, i) => (
                            <li key={i}>{feature}</li>
                        ))}
                    </ul>
                )}
                <Button onClick={onClick} className={classnames(['w100 mtauto', active && 'pm-button--primary'])}>
                    {c('Plan Action').t`Get ${plan.title}`}
                </Button>
            </div>
        </div>
    );
};

PlanCard.propTypes = {
    plan: PropTypes.shape({
        title: PropTypes.string.isRequired,
        description: PropTypes.string,
        features: PropTypes.arrayOf(PropTypes.string),
        highlights: PropTypes.arrayOf(PropTypes.string),
        isBest: PropTypes.bool
    }).isRequired,
    currency: PropTypes.string.isRequired,
    isAnnual: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
    active: PropTypes.bool
};

export default PlanCard;
