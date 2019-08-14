import React from 'react';
import PropTypes from 'prop-types';
import { classnames, Button } from 'react-components';

const PlanCard = ({ active, title, monthlyPrice, discount, description, features, action, onClick }) => {
    const saved = monthlyPrice * 0.12 * discount;
    const price = (monthlyPrice / 100) * discount;

    return (
        <div className="flex-autogrid-item">
            <div className="p1">
                <strong className="biggest">{title}</strong>
            </div>
            <div
                role="button"
                onClick={onClick}
                className={classnames(['plan-card p1 h100 flex flex-column', active && 'plan-card--active'])}
            >
                <div>
                    <sup>€</sup>
                    <strong>{price}</strong>
                    <span>/ mo</span>
                </div>
                <div>
                    Charging you {price * 12} € yearly
                    {saved > 0 && <strong>save {saved} €</strong>}
                </div>
                {description && <div className="border-bottom">{description}</div>}
                {features && (
                    <ul>
                        {features.map((feature, i) => (
                            <li key={i}>{feature}</li>
                        ))}
                    </ul>
                )}
                <Button onClick={onClick} className={classnames(['w100 mtauto', active && 'pm-button--primary'])}>
                    {action}
                </Button>
            </div>
        </div>
    );
};

PlanCard.propTypes = {
    title: PropTypes.string.isRequired,
    monthlyPrice: PropTypes.number.isRequired,
    action: PropTypes.string.isRequired,
    active: PropTypes.bool,
    discount: PropTypes.number,
    description: PropTypes.string,
    features: PropTypes.arrayOf(PropTypes.string)
};

export default PlanCard;
