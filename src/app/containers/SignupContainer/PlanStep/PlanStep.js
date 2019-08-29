import React, { useState } from 'react';
import PropTypes from 'prop-types';
import PlansSection from './PlansSection/PlansSection';
import EmailSection from './EmailSection/EmailSection';
import PaymentDetailsSection from './PaymentDetailsSection/PaymentDetailsSection';
import SelectedPlan from './SelectedPlan/SelectedPlan';
import FreeSignupSection from './FreeSignupSection/FreeSignupSection';
import { PLANS } from 'proton-shared/lib/constants';
import useSignup from '../useSignup';

const PlanStep = ({ onConfirm }) => {
    const [isNudgeSuccessful, setNudgeSuccessful] = useState(false); // If successfully convinced to purchase plus plan
    const {
        model: { email },
        updateModel,
        selectedPlan
    } = useSignup();

    // ! TODO: do not allow payment without a valid email

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
            // TODO: focus on email and show error of no email
            document.querySelector('#payment').scrollIntoView({ behavior: 'smooth' });
        } else if (email) {
            onConfirm(); // No payment details for free user
        }
    };

    return (
        <>
            <PlansSection onSelect={handleChangePlan} />
            <div className="flex" id="details">
                <div className="flex-item-fluid">
                    <EmailSection />
                    {(selectedPlan.planName === PLANS.FREE || isNudgeSuccessful) && (
                        <FreeSignupSection
                            onContinue={handleContinueClick}
                            onUpgrade={handleUpgradeClick}
                            isPlusActive={isNudgeSuccessful}
                        />
                    )}
                    {selectedPlan.planName !== PLANS.FREE && <PaymentDetailsSection onPaymentDone={onConfirm} />}
                </div>
                <SelectedPlan />
            </div>
        </>
    );
};

PlanStep.propTypes = {
    onConfirm: PropTypes.func.isRequired
};

export default PlanStep;
