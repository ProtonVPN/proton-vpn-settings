import React, { useState } from 'react';
import { RadioGroup, Label, Row, Details, Summary } from 'react-components';
import RadioAccordion, { Option } from '../../../components/RadioAccordion';
import { c } from 'ttag';

const PaymentDetailsSection = () => {
    const [currency, setCurrency] = useState('eur');
    const [activeMethod, setActiveMethod] = useState('paypal');

    return (
        <>
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
                <Option id="paypal" title={c('Option').t`PayPal`}>
                    paypalas
                </Option>
                <Option id="credit-card" title={c('Option').t`Credit Card`}>
                    kreditke
                </Option>
            </RadioAccordion>
        </>
    );
};

export default PaymentDetailsSection;
