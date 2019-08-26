import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Field, Row, PrimaryButton, EmailInput } from 'react-components';
import { c } from 'ttag';

const VerificationEmailInput = ({ onSendClick, loading }) => {
    const [email, setEmail] = useState('');

    const handleChange = ({ target }) => setEmail(target.value);
    const handleSendClick = () => onSendClick(email);

    return (
        <Row>
            <Field className="mr1">
                <EmailInput value={email} onChange={handleChange} placeholder={c('Placeholder').t`Email`} />
            </Field>
            <PrimaryButton loading={loading} onClick={handleSendClick}>{c('Action').t`Send`}</PrimaryButton>
        </Row>
    );
};

VerificationEmailInput.propTypes = {
    onSendClick: PropTypes.func.isRequired,
    loading: PropTypes.bool
};

export default VerificationEmailInput;
