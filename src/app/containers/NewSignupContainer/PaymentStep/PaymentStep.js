import React from 'react';
import PropTypes from 'prop-types';
import { Alert, Payment, usePayment, useLoading, PrimaryButton, Field, Label, Row } from 'react-components';
import { c } from 'ttag';
import { DEFAULT_CYCLE, PAYMENT_METHOD_TYPES } from 'proton-shared/lib/constants';
import useSignup from '../useSignup';
import SelectedPlan from '../SelectedPlan';

const PaymentStep = ({ onPaymentDone }) => {
    const [loading, withLoading] = useLoading();
    const {
        model: { currency },
        checkPayment,
        selectedPlan
    } = useSignup();
    const { method, setMethod, parameters, canPay, setParameters, setCardValidity } = usePayment();

    const handlePayment = async () => {
        await withLoading(checkPayment(parameters));
        onPaymentDone(); // TODO: send payment params
    };

    return (
        <>
            <h3>{c('Title').t`Select a payment method`}</h3>
            <Row>
                <div>
                    <Alert>{c('Info').t`Your payment details are protected with TLS encryption and Swiss laws`}</Alert>
                    <Payment
                        type="signup"
                        method={method}
                        amount={selectedPlan.price.total}
                        cycle={DEFAULT_CYCLE}
                        currency={currency}
                        parameters={parameters}
                        onParameters={setParameters}
                        onMethod={setMethod}
                        onValidCard={setCardValidity}
                        onPay={handlePayment}
                    />
                    {method === PAYMENT_METHOD_TYPES.CARD && (
                        <Row>
                            <Label></Label>
                            <Field>
                                <PrimaryButton loading={loading} disabled={!canPay} onClick={handlePayment}>{c('Action')
                                    .t`Confirm Payment`}</PrimaryButton>
                            </Field>
                        </Row>
                    )}
                </div>
                <SelectedPlan />
            </Row>
        </>
    );
};

PaymentStep.propTypes = {
    onPaymentDone: PropTypes.func.isRequired
};

export default PaymentStep;
