import React, { useState } from 'react';
import PropTypes from 'prop-types';
import VerificationMethodForm from './VerificationMethodForm/VerificationMethodForm';
import VerificationCodeForm from './VerificationCodeForm/VerificationCodeForm';

const VerificationForm = ({ defaultEmail, allowedMethods, onRequestCode, onSubmit }) => {
    const [params, setParams] = useState(null);

    const handleResend = () => setParams(null);

    const handleSubmitMethod = (params) => {
        onRequestCode(params);
        setParams(params);
    };

    const handleSubmitCode = (code) => onSubmit(code, params);

    if (!params) {
        return (
            <VerificationMethodForm
                defaultEmail={defaultEmail}
                allowedMethods={allowedMethods}
                onSubmit={handleSubmitMethod}
            />
        );
    }

    return <VerificationCodeForm onSubmit={handleSubmitCode} onResend={handleResend} />;
};

VerificationForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onRequestCode: PropTypes.func.isRequired,
    defaultEmail: PropTypes.string.isRequired,
    allowedMethods: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default VerificationForm;
