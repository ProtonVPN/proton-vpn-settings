import React from 'react';
import PropTypes from 'prop-types';
import { classnames, Button } from 'react-components';
import { c } from 'ttag';
import PlanPrice from './PlanPrice';

const PlanCardHorizontal = ({ active, plan, isAnnual, onClick }) => {
    return (
        <div
            className={classnames(['plan-card w100 border-top', active && 'plan-card--active'])}
            role="button"
            onClick={onClick}
        >
            <div>
                <strong className="biggest">{plan.title}</strong>
                <div>{plan.description}</div>
            </div>

            <PlanPrice plan={plan} isAnnual={isAnnual} />
            <div className="w30 flex flex-column">
                <Button onClick={onClick} className={classnames(['mtauto mbauto', active && 'pm-button--primary'])}>
                    {c('Plan Action').t`Get ${plan.title}`}
                </Button>
            </div>
        </div>
    );
};

PlanCardHorizontal.propTypes = {
    plan: PropTypes.shape({
        title: PropTypes.string.isRequired,
        description: PropTypes.string
    }).isRequired,
    isAnnual: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
    active: PropTypes.bool
};

export default PlanCardHorizontal;
