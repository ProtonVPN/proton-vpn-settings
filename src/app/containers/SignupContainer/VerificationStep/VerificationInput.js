import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Row, Field, Input, PrimaryButton } from 'react-components';
import { c } from 'ttag';

const VerificationInput = ({ isLoading, onValidate }) => {
    const [code, setCode] = useState('');

    const handleValidate = () => onValidate(code);
    const handleChangeCode = ({ target }) => setCode(target.value);

    return (
        <Row>
            <Field className="mr1">
                <Input
                    value={code}
                    onChange={handleChangeCode}
                    onPressEnter={handleValidate}
                    placeholder={c('Placeholder').t`Verification code`}
                />
            </Field>
            <PrimaryButton onClick={handleValidate} loading={isLoading}>{c('Action').t`Validate`}</PrimaryButton>
        </Row>
    );
};

VerificationInput.propTypes = {
    isLoading: PropTypes.bool,
    onValidate: PropTypes.func.isRequired
};

export default VerificationInput;
