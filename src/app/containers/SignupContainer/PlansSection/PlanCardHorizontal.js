import React from 'react';
import PropTypes from 'prop-types';
import { classnames, Button } from 'react-components';

const PlanCardHorizontal = ({ active, title, monthlyPrice, discount, description, action, onClick }) => {
    const saved = monthlyPrice * 0.12 * discount;
    const price = (monthlyPrice / 100) * discount;

    return (
        <div className={classnames(['plan-card w100', active && 'plan-card--active'])} role="button" onClick={onClick}>
            <div>
                <strong className="biggest">{title}</strong>
                <div>{description}</div>
            </div>
            <div>
                <div>
                    <sup>€</sup>
                    <strong>{price}</strong>
                    <span>/ mo</span>
                </div>
                <div>
                    Charging you {price * 12} € yearly
                    {saved > 0 && <strong>save {saved} €</strong>}
                </div>
            </div>
            <div className="w30 flex flex-column">
                <Button onClick={onClick} className={classnames(['mtauto mbauto', active && 'pm-button--primary'])}>
                    {action}
                </Button>
            </div>
        </div>
    );
};

PlanCardHorizontal.propTypes = {
    title: PropTypes.string.isRequired,
    monthlyPrice: PropTypes.number.isRequired,
    action: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    active: PropTypes.bool,
    discount: PropTypes.number,
    description: PropTypes.string
};

export default PlanCardHorizontal;
