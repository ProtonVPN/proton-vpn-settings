import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Row } from 'react-components';
import { c } from 'ttag';
import VerificationMethodSelector from './VerificationMethodSelector';
import VerificationEmailInput from './VerificationEmailInput';
import VerificationPhoneInput from './VerificationPhoneInput';

const VERIFICATION_METHOD = {
    SMS: 'sms',
    EMAIL: 'email'
};

const VerificationMethodForm = ({ defaultEmail, allowedMethods, onSubmit }) => {
    const [method, setMethod] = useState(VERIFICATION_METHOD.EMAIL);

    const handleSendEmailCode = (Address) => onSubmit({ Type: VERIFICATION_METHOD.EMAIL, Destination: { Address } });
    const handleSendSMSCode = (Phone) => onSubmit({ Type: VERIFICATION_METHOD.SMS, Destination: { Phone } });

    const methods = Object.values(VERIFICATION_METHOD).filter((method) => allowedMethods.includes(method));

    return (
        <div>
            <Row className="flex-spacebetween">
                <h3>{c('Title').t`Select a verification method`}</h3>
                <div>
                    <VerificationMethodSelector method={method} onSelect={setMethod} allowedMethods={methods} />
                </div>
            </Row>

            {method === VERIFICATION_METHOD.EMAIL && (
                <VerificationEmailInput defaultEmail={defaultEmail} onSendClick={handleSendEmailCode} />
            )}

            {method === VERIFICATION_METHOD.SMS && <VerificationPhoneInput onSendClick={handleSendSMSCode} />}
        </div>
    );
};

VerificationMethodForm.propTypes = {
    defaultEmail: PropTypes.string.isRequired,
    allowedMethods: PropTypes.arrayOf(PropTypes.string).isRequired,
    onSubmit: PropTypes.func.isRequired
};

export default VerificationMethodForm;
