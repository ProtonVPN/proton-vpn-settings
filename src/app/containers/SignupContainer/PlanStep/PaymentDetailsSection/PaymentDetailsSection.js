import React from 'react';
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
    useLoading
} from 'react-components';
import { c } from 'ttag';
import { DEFAULT_CYCLE, PAYMENT_METHOD_TYPES, CURRENCIES } from 'proton-shared/lib/constants';
import CouponForm from 'react-components/containers/payments/subscription/CouponForm';
import GiftCodeForm from 'react-components/containers/payments/subscription/GiftCodeForm';
import useSignup from '../../useSignup';

// TODO: use form submit
const PaymentDetailsSection = ({ onPaymentDone }) => {
    const { state: editingCoupon, toggle: toggleEditCoupon } = useToggle();
    const { state: editingGiftCode, toggle: toggleEditGiftCode } = useToggle();
    const [loadingCoupon, withLoadingCoupon] = useLoading();
    const [loadingGift, withLoadingGiftCode] = useLoading();
    const [loadingVerify, withLoadingVerify] = useLoading();
    const {
        selectedPlan,
        model: { currency, appliedCoupon, appliedGiftCode },
        applyCoupon,
        applyGiftCode,
        checkPayment,
        updateModel
    } = useSignup();
    const { method, setMethod, parameters, canPay, setParameters, setCardValidity } = usePayment();

    const amount = selectedPlan.price.total;

    const handleChangeCurrency = (currency) => updateModel({ currency });
    const handleApplyCoupon = async ({ coupon }) => {
        try {
            await withLoadingCoupon(applyCoupon(coupon));
            toggleEditCoupon();
        } catch (e) {
            toggleEditCoupon();
        }
    };

    const handleApplyGiftCode = async ({ gift }) => {
        try {
            await withLoadingGiftCode(applyGiftCode(gift));
            toggleEditGiftCode();
        } catch (e) {
            toggleEditGiftCode();
        }
    };

    const handlePayment = async () => {
        await withLoadingVerify(checkPayment(parameters));
        onPaymentDone(true);
    };

    const tosLink = <Href url="https://protonvpn.com/terms-and-conditions">{c('Link').t`Terms of Service`}</Href>;
    const policyLink = <Href url="https://protonvpn.com/privacy-policy">{c('Link').t`Privacy Policy`}</Href>;

    return (
        <div className="mb2" id="payment">
            <SubTitle>{c('Title').t`3. Enter payment details`}</SubTitle>
            <Alert>
                {c('Info').jt`By completing your payment, you agree to abide by our ${tosLink} and ${policyLink}`}
            </Alert>

            <Row>
                <Label htmlFor="coupon">{c('Label').t`Coupon`}</Label>
                <Field>
                    {editingCoupon ? (
                        <CouponForm
                            id="coupon"
                            loading={loadingCoupon}
                            onChange={handleApplyCoupon}
                            model={{ coupon: '' }}
                        />
                    ) : appliedCoupon ? (
                        <strong>{appliedCoupon.Coupon.Description}</strong>
                    ) : (
                        <LinkButton onClick={toggleEditCoupon} className="mr1">{c('Action').t`Use coupon`}</LinkButton>
                    )}
                </Field>
            </Row>
            <Row>
                <Label htmlFor="gift-code">{c('Label').t`Gift code`}</Label>
                <Field>
                    {editingGiftCode ? (
                        <GiftCodeForm
                            id="gift-code"
                            loading={loadingGift}
                            onChange={handleApplyGiftCode}
                            model={{ gift: '' }}
                        />
                    ) : appliedGiftCode ? (
                        <strong>{appliedGiftCode.Coupon.Description}</strong>
                    ) : (
                        <LinkButton onClick={toggleEditGiftCode} className="mr1">{c('Action')
                            .t`Use gift code`}</LinkButton>
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

            {amount > 0 && (
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
                    onPay={handlePayment}
                />
            )}

            {(method === PAYMENT_METHOD_TYPES.CARD || !amount) && (
                <Row>
                    <Label></Label>
                    <Field>
                        <PrimaryButton loading={loadingVerify} disabled={amount && !canPay} onClick={handlePayment}>{c(
                            'Action'
                        ).t`Confirm Payment`}</PrimaryButton>
                    </Field>
                </Row>
            )}
        </div>
    );
};

PaymentDetailsSection.propTypes = {
    onPaymentDone: PropTypes.func.isRequired
};

export default PaymentDetailsSection;
