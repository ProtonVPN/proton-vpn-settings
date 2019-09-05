import React from 'react';
import PropTypes from 'prop-types';
import { c } from 'ttag';
import { classnames } from 'react-components';

const PlanDetails = ({ selectedPlan: { title, additionalFeatures, features } }) => {
    return (
        <div className="flex flex-column bordered-container">
            <h6 className="p0-5 mb0 w100 aligncenter bg-primary color-white">{c('Title').t`${title} plan details`}</h6>
            <div className="p1">
                <ul
                    className={classnames([
                        'selected-plan-list unstyled m0',
                        !additionalFeatures && 'selected-plan-list--negative'
                    ])}
                >
                    {additionalFeatures && <li>{additionalFeatures}</li>}
                    {features.map((feature, i) => (
                        <li key={i}>{feature}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

PlanDetails.propTypes = {
    selectedPlan: PropTypes.object.isRequired
};

export default PlanDetails;
