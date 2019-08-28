import React from 'react';
import PropTypes from 'prop-types';
import { classnames, Button } from 'react-components';
import { c } from 'ttag';
import PlanPrice from './PlanPrice';
import useSignup from '../../useSignup';

const PlanCardHorizontal = ({ plan, onClick }) => {
    const { selectedPlan } = useSignup();

    const isActive = selectedPlan.planName === plan.planName;
    return (
        <div
            className={classnames(['plan-card w100 border-top', isActive && 'plan-card--active'])}
            role="button"
            onClick={onClick}
        >
            <div>
                <strong className="biggest">{plan.title}</strong>
                <div>{plan.description}</div>
            </div>

            <PlanPrice plan={plan} />
            <div className="w30 flex flex-column">
                <Button onClick={onClick} className={classnames(['mtauto mbauto', isActive && 'pm-button--primary'])}>
                    {c('Plan Action').t`Get ${plan.title}`}
                </Button>
            </div>
        </div>
    );
};

PlanCardHorizontal.propTypes = {
    plan: PropTypes.shape({
        planName: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        description: PropTypes.string
    }).isRequired,
    onClick: PropTypes.func.isRequired
};

export default PlanCardHorizontal;
