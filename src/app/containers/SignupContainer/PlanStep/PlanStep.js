import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ObserverSections } from 'react-components';
import PlansSection from './PlansSection/PlansSection';
import EmailSection from './EmailSection/EmailSection';
import PaymentDetailsSection from './PaymentDetailsSection/PaymentDetailsSection';
import SelectedPlan from './SelectedPlan/SelectedPlan';
import FreeSignupSection from './FreeSignupSection/FreeSignupSection';
import { PLANS } from 'proton-shared/lib/constants';
import useSignup from '../useSignup';

const PlanStep = ({ onConfirm }) => {
    const [isNudgeSuccessful, setNudgeSuccessful] = useState(false); // If successfully convinced to purchase plus plan
    const { model, updateModel, selectedPlan } = useSignup();
    const { isAnnual, currency, planName } = model;

    // ! TODO: do not allow payment without a valid email
    const handlePaymentDone = (paymentDetails = null) => {
        updateModel({ paymentDetails });
        onConfirm(paymentDetails);
    };

    const handleChangePlan = (planName) => {
        if (planName === PLANS.FREE && isNudgeSuccessful) {
            setNudgeSuccessful(false);
        }
        updateModel({ planName });
    };

    const handleUpgradeClick = () => {
        updateModel({ planName: PLANS.VPNPLUS });
        setNudgeSuccessful(true);
    };

    const handleContinueClick = () => {
        if (isNudgeSuccessful) {
            location.replace('/signup#payment');
        } else if (model.email) {
            onConfirm(); // No payment details
        }
        // TODO: focus on email and show error of no email
    };

    return (
        <ObserverSections>
            <PlansSection
                isAnnual={isAnnual}
                currency={currency}
                onAnnualChange={(isAnnual) => updateModel({ isAnnual })}
                onSelect={handleChangePlan}
                selected={planName}
                id="plan"
            />
            <div className="flex" id="details">
                <div className="flex-item-fluid">
                    <div className="container-section-sticky-section" id="email">
                        <EmailSection />
                        {(planName === PLANS.FREE || isNudgeSuccessful) && (
                            <FreeSignupSection
                                onContinue={handleContinueClick}
                                onUpgrade={handleUpgradeClick}
                                isPlusActive={isNudgeSuccessful}
                            />
                        )}
                    </div>
                    {planName !== PLANS.FREE && (
                        <div className="container-section-sticky-section" id="payment">
                            <PaymentDetailsSection
                                onPaymentDone={handlePaymentDone}
                                onChangeCurrency={(currency) => updateModel({ currency })}
                                amount={selectedPlan.price.total}
                            />
                        </div>
                    )}
                </div>
                <SelectedPlan />
            </div>
        </ObserverSections>
    );
};

PlanStep.propTypes = {
    onConfirm: PropTypes.func.isRequired
};

export default PlanStep;
