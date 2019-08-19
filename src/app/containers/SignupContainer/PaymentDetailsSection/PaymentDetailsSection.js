import React, { useState } from 'react';
import { RadioGroup, Label, Row, SubTitle } from 'react-components';
import RadioAccordion, { Option } from '../../../components/RadioAccordion';
import { c } from 'ttag';
import PayPal from './PayPal';
import mastercardSvg from 'design-system/assets/img/shared/bank-icons/cc-mastercard.svg';
import visaSvg from 'design-system/assets/img/shared/bank-icons/cc-visa.svg';
import CreditCard from './CreditCard';

const PaymentDetailsSection = () => {
    const [currency, setCurrency] = useState('eur');
    const [activeMethod, setActiveMethod] = useState('paypal');

    return (
        <>
            <SubTitle>{c('Title').t`3. Enter payment details`}</SubTitle>
            <Label htmlFor="currency">{c('Label').t`Select Currency`}</Label>
            <Row>
                <RadioGroup
                    id="currency"
                    name="currency"
                    onChange={setCurrency}
                    value={currency}
                    options={[
                        { label: c('Currency').t`EUR`, value: 'eur' },
                        { label: c('Currency').t`USD`, value: 'usd' },
                        { label: c('Currency').t`CHF`, value: 'chf' }
                    ]}
                />
            </Row>

            <RadioAccordion name="payment-method" active={activeMethod} onSelect={setActiveMethod}>
                <Option
                    id="paypal"
                    title={
                        <>
                            {c('Option').t`PayPal`}
                            <img className="ml0-5" width={78} src="https://account.protonvpn.com/assets/paypal.svg" />
                        </>
                    }
                >
                    <PayPal />
                </Option>
                <Option
                    id="credit-card"
                    title={
                        <>
                            {c('Option').t`Credit Card`}
                            <img className="ml0-5" width={20} src={visaSvg} />
                            <img className="ml0-5" width={20} src={mastercardSvg} />
                        </>
                    }
                >
                    <CreditCard />
                </Option>
            </RadioAccordion>
        </>
    );
};

export default PaymentDetailsSection;
