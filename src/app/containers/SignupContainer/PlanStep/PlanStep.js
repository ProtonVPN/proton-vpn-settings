import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ObserverSections } from 'react-components';
import PlansSection from './PlansSection/PlansSection';
import EmailSection from './EmailSection/EmailSection';
import PaymentDetailsSection from './PaymentDetailsSection/PaymentDetailsSection';
import SelectedPlan from './SelectedPlan/SelectedPlan';
import FreeSignupSection from './FreeSignupSection/FreeSignupSection';
import { PLANS, DEFAULT_CURRENCY } from 'proton-shared/lib/constants';
import { getPlan, getPlanPrice } from './plans';

const PlanStep = ({ plan, onSubmitEmail, onNextStep, onChangePlan }) => {
    const [isAnnual, setIsAnnual] = useState(false);
    const [currency, setCurrency] = useState(DEFAULT_CURRENCY);
    // If successfully convinced to purchase plus plan
    const [isNudgeSuccessful, setNudgeSuccessful] = useState(false);

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
        } else {
            onNextStep();
        }
    };

    const selectedPlan = getPlan(plan);
    const { totalPrice } = getPlanPrice(plan, isAnnual);

    return (
        <ObserverSections>
            <PlansSection
                isAnnual={isAnnual}
                onAnnualChange={setIsAnnual}
                onSelect={handleChangePlan}
                selected={plan}
                id="plan"
            />
            <div className="flex" id="details">
                <div className="flex-item-fluid">
                    <div className="container-section-sticky-section" id="email">
                        <EmailSection onSubmitEmail={handleContinueClick} onEnterEmail={onSubmitEmail} />
                        {(plan === PLANS.FREE || isNudgeSuccessful) && (
                            <FreeSignupSection
                                onContinue={handleContinueClick}
                                onUpgrade={handleUpgradeClick}
                                plusActive={isNudgeSuccessful}
                            />
                        )}
                    </div>
                    {plan !== PLANS.FREE && (
                        <div className="container-section-sticky-section" id="payment">
                            <PaymentDetailsSection onChangeCurrency={setCurrency} amount={totalPrice} />
                        </div>
                    )}
                </div>
                <SelectedPlan currency={currency} isAnnual={isAnnual} plan={selectedPlan} />
            </div>
        </ObserverSections>
    );
};

PlanStep.propTypes = {
    plan: PropTypes.string.isRequired,
    onSubmitEmail: PropTypes.func.isRequired,
    onNextStep: PropTypes.func.isRequired,
    onChangePlan: PropTypes.func.isRequired
};

export default PlanStep;
