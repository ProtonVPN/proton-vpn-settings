import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { DialogModal, HeaderModal, InnerModal, usePlans } from 'react-components';
import { c } from 'ttag';
import { CYCLE, CURRENCIES } from 'proton-shared/lib/constants';
import PlansTable from '../../../components/sections/plans/PlansTable';

const { MONTHLY, YEARLY, TWO_YEARS } = CYCLE;

const PlanComparisonModal = ({
    modalTitleID = 'modalTitle',
    onClose,
    selectedPlanName,
    defaultCycle,
    defaultCurrency,
    ...rest
}) => {
    const [cycle, setCycle] = useState(defaultCycle);
    const [currency, setCurrency] = useState(defaultCurrency);
    const [plans, loadingPlans] = usePlans();

    const selected = plans.filter(({ Name }) => Name === selectedPlanName);

    return (
        <DialogModal {...rest} className="pm-modal--wider">
            <HeaderModal hasClose modalTitleID={modalTitleID} onClose={onClose}>
                {c('Title').t`ProtonVPN plan comparison`}
            </HeaderModal>
            <div className="pm-modalContent">
                <InnerModal>
                    <PlansTable
                        subscription={{ Plans: selected }}
                        loading={loadingPlans}
                        currency={currency}
                        cycle={cycle}
                        updateCurrency={setCurrency}
                        updateCycle={setCycle}
                        plans={plans}
                        extendedDetails
                    />
                </InnerModal>
            </div>
        </DialogModal>
    );
};

PlanComparisonModal.propTypes = {
    ...DialogModal.propTypes,
    selectedPlanName: PropTypes.string.isRequired,
    cycle: PropTypes.oneOf([MONTHLY, TWO_YEARS, YEARLY]).isRequired,
    currency: PropTypes.oneOf(CURRENCIES).isRequired
};

export default PlanComparisonModal;
