import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Row, useLoading } from 'react-components';
import { c } from 'ttag';
import VerificationMethodSelector from './VerificationMethodSelector';
import VerificationEmailInput from './VerificationEmailInput';
import VerificationPhoneInput from './VerificationPhoneInput';
import { TOKEN_TYPES } from 'proton-shared/lib/constants';

const VERIFICATION_METHOD = {
    SMS: TOKEN_TYPES.SMS,
    EMAIL: TOKEN_TYPES.EMAIL
};

const VerificationMethodForm = ({ defaultEmail, allowedMethods, onSubmit }) => {
    const [loading, withLoading] = useLoading();
    const [method, setMethod] = useState(VERIFICATION_METHOD.EMAIL);

    const handleSendEmailCode = (Address) =>
        withLoading(onSubmit({ Type: VERIFICATION_METHOD.EMAIL, Destination: { Address } }));
    const handleSendSMSCode = (Phone) =>
        withLoading(onSubmit({ Type: VERIFICATION_METHOD.SMS, Destination: { Phone } }));

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
                <VerificationEmailInput
                    loading={loading}
                    defaultEmail={defaultEmail}
                    onSendClick={handleSendEmailCode}
                />
            )}

            {method === VERIFICATION_METHOD.SMS && (
                <VerificationPhoneInput loading={loading} onSendClick={handleSendSMSCode} />
            )}
        </div>
    );
};

VerificationMethodForm.propTypes = {
    defaultEmail: PropTypes.string.isRequired,
    allowedMethods: PropTypes.arrayOf(PropTypes.string).isRequired,
    onSubmit: PropTypes.func.isRequired
};

export default VerificationMethodForm;
