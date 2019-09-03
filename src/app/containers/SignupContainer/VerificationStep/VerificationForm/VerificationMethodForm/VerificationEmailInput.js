import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Field, Row, PrimaryButton, EmailInput, Label } from 'react-components';
import { c } from 'ttag';

const VerificationEmailInput = ({ defaultEmail = '', onSendClick, loading }) => {
    const [email, setEmail] = useState(defaultEmail);

    const handleChange = ({ target }) => setEmail(target.value);
    const handleSendClick = () => onSendClick(email);

    return (
        <>
            <Row>
                <Label>{c('Label').t`Email address`}</Label>
                <Field className="mr1">
                    <EmailInput value={email} onChange={handleChange} placeholder={c('Placeholder').t`Email`} />
                </Field>
            </Row>
            <PrimaryButton disabled={!email} loading={loading} onClick={handleSendClick}>{c('Action')
                .t`Send`}</PrimaryButton>
        </>
    );
};

VerificationEmailInput.propTypes = {
    onSendClick: PropTypes.func.isRequired,
    defaultEmail: PropTypes.string,
    loading: PropTypes.bool
};

export default VerificationEmailInput;
