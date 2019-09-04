import React from 'react';
import PropTypes from 'prop-types';
import { c } from 'ttag';

const PlanDetails = ({ selectedPlan: { title, additionalFeatures, features } }) => {
    return (
        <div className="flex flex-column bordered-container">
            <h6 className="p0-5 mb0 w100 aligncenter bg-primary color-white">{c('Title').t`${title} plan details`}</h6>
            <div className="p1">
                {additionalFeatures && (
                    <>
                        <div>{additionalFeatures}</div>
                        <strong className="color-global-success">+</strong>
                    </>
                )}
                <ul className="unstyled m0">
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
