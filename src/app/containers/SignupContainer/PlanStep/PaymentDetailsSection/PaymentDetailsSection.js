import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
    RadioGroup,
    Label,
    Row,
    SubTitle,
    Payment,
    usePayment,
    useToggle,
    LinkButton,
    Alert,
    Href,
    PrimaryButton,
    Field,
    useApiWithoutResult
} from 'react-components';
import { c } from 'ttag';
import { DEFAULT_CYCLE, DEFAULT_CURRENCY, PAYMENT_METHOD_TYPES, CURRENCIES } from 'proton-shared/lib/constants';
import CouponForm from 'react-components/containers/payments/subscription/CouponForm';
import GiftCodeForm from 'react-components/containers/payments/subscription/GiftCodeForm';
import { verifyPayment } from 'proton-shared/lib/api/payments';

// TODO: use form submit
const PaymentDetailsSection = ({ onChangeCurrency, amount, onAddPaymentMethod }) => {
    const [currency, setCurrency] = useState(DEFAULT_CURRENCY);
    const { state: hasCoupon, toggle: toggleCoupon } = useToggle();
    const { state: hasGiftCode, toggle: toggleGiftCode } = useToggle();
    const { method, setMethod, parameters, canPay, setParameters, setCardValidity } = usePayment();
    // TODO: Credit wtf?
    // TODO: Gift codes
    const { loading: loading, request: requestVerifyPayment } = useApiWithoutResult(() =>
        verifyPayment({
            Amount: amount,
            Currency: currency,
            ...parameters
        })
    );

    const handleChangeCurrency = (value) => {
        setCurrency(value);
        onChangeCurrency(value);
    };

    const handleAddPaymentMethod = async () => {
        const { VerifyCode } = await requestVerifyPayment();
        onAddPaymentMethod(VerifyCode);
    };

    const tosLink = <Href url="https://protonvpn.com/terms-and-conditions">{c('Link').t`Terms of Service`}</Href>;
    const policyLink = <Href url="https://protonvpn.com/privacy-policy">{c('Link').t`Privacy Policy`}</Href>;

    return (
        <>
            <SubTitle>{c('Title').t`3. Enter payment details`}</SubTitle>
            <Alert>
                {c('Info').jt`By completing your payment, you agree to abide by our ${tosLink} and ${policyLink}`}
            </Alert>

            <Row>
                <Label htmlFor="coupon">{c('Label').t`Coupon`}</Label>
                <Field>
                    {hasCoupon ? (
                        <CouponForm id="coupon" model={{ coupon: '' }} />
                    ) : (
                        <LinkButton onClick={toggleCoupon} className="mr1">{c('Action').t`Use coupon`}</LinkButton>
                    )}
                </Field>
            </Row>
            <Row>
                <Label htmlFor="gift-code">{c('Label').t`Gift code`}</Label>
                <Field>
                    {hasGiftCode ? (
                        <GiftCodeForm id="gift-code" model={{ gift: '' }} />
                    ) : (
                        <LinkButton onClick={toggleGiftCode} className="mr1">{c('Action').t`Use gift code`}</LinkButton>
                    )}
                </Field>
            </Row>

            <Row>
                <Label htmlFor="currency">{c('Label').t`Select Currency`}</Label>
                <RadioGroup
                    id="currency"
                    name="currency"
                    onChange={handleChangeCurrency}
                    value={currency}
                    options={CURRENCIES.map((value) => ({ label: value, value }))}
                />
            </Row>

            <Payment
                type="signup"
                method={method}
                amount={amount}
                cycle={DEFAULT_CYCLE}
                currency={currency}
                parameters={parameters}
                onParameters={setParameters}
                onMethod={setMethod}
                onValidCard={setCardValidity}
                onPay={handleAddPaymentMethod}
            />

            {method === PAYMENT_METHOD_TYPES.CARD && (
                <Row>
                    <Label />
                    <Field>
                        <PrimaryButton loading={loading} disabled={!canPay} onClick={handleAddPaymentMethod}>{c(
                            'Action'
                        ).t`Confirm Payment`}</PrimaryButton>
                    </Field>
                </Row>
            )}
        </>
    );
};

PaymentDetailsSection.propTypes = {
    amount: PropTypes.number.isRequired,
    onChangeCurrency: PropTypes.func.isRequired,
    onAddPaymentMethod: PropTypes.func.isRequired
};

export default PaymentDetailsSection;
