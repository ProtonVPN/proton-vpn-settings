import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ObserverSections, usePlans } from 'react-components';
import PlansSection from './PlansSection/PlansSection';
import EmailSection from './EmailSection/EmailSection';
import PaymentDetailsSection from './PaymentDetailsSection/PaymentDetailsSection';
import SelectedPlan from './SelectedPlan/SelectedPlan';
import FreeSignupSection from './FreeSignupSection/FreeSignupSection';
import { PLANS, DEFAULT_CURRENCY } from 'proton-shared/lib/constants';
import { getPlan } from './plans';

const PlanStep = ({ planName, email, onSubmitEmail, onConfirm, onAddPaymentMethod, onChangePlan }) => {
    const [isAnnual, setIsAnnual] = useState(false);
    const [currency, setCurrency] = useState(DEFAULT_CURRENCY);
    // If successfully convinced to purchase plus plan
    const [isNudgeSuccessful, setNudgeSuccessful] = useState(false);
    const [plans] = usePlans();

    const confirm = () => onConfirm(isAnnual, currency);

    const handleChangePlan = (plan) => {
        if (plan === PLANS.FREE && isNudgeSuccessful) {
            setNudgeSuccessful(false);
        }
        onChangePlan(plan);
    };

    const handleUpgradeClick = () => {
        onChangePlan(PLANS.VPNPLUS);
        setNudgeSuccessful(true);
    };

    const handleContinueClick = () => {
        if (isNudgeSuccessful) {
            location.replace('/signup#payment');
        } else if (email) {
            confirm();
        }
    };

    // TODO: if no email, focus email input and show error
    const handleAddPaymentMethod = (...rest) => {
        onAddPaymentMethod(...rest);
        confirm();
    };

    const selectedPlan = getPlan(planName, isAnnual, plans);

    return (
        <ObserverSections>
            <PlansSection
                isAnnual={isAnnual}
                currency={currency}
                onAnnualChange={setIsAnnual}
                onSelect={handleChangePlan}
                selected={planName}
                id="plan"
            />
            <div className="flex" id="details">
                <div className="flex-item-fluid">
                    <div className="container-section-sticky-section" id="email">
                        <EmailSection onContinue={handleContinueClick} onEnterEmail={onSubmitEmail} />
                        {(planName === PLANS.FREE || isNudgeSuccessful) && (
                            <FreeSignupSection
                                onContinue={handleContinueClick}
                                onUpgrade={handleUpgradeClick}
                                plusActive={isNudgeSuccessful}
                            />
                        )}
                    </div>
                    {planName !== PLANS.FREE && (
                        <div className="container-section-sticky-section" id="payment">
                            <PaymentDetailsSection
                                onAddPaymentMethod={handleAddPaymentMethod}
                                onChangeCurrency={setCurrency}
                                amount={selectedPlan.price.total}
                            />
                        </div>
                    )}
                </div>
                <SelectedPlan currency={currency} isAnnual={isAnnual} plan={selectedPlan} />
            </div>
        </ObserverSections>
    );
};

PlanStep.propTypes = {
    email: PropTypes.string.isRequired,
    planName: PropTypes.string.isRequired,
    onChangePlan: PropTypes.func.isRequired,
    onSubmitEmail: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onAddPaymentMethod: PropTypes.func.isRequired
};

export default PlanStep;
