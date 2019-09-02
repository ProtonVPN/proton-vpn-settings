import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Field, Row, PrimaryButton, TelInput, Label } from 'react-components';
import { c } from 'ttag';

const VerificationPhoneInput = ({ onSendClick, loading }) => {
    const [phone, setPhone] = useState('');

    const handleChangePhone = ({ target }) => setPhone(target.value);
    const handleSendClick = () => onSendClick(phone);

    return (
        <>
            <Row>
                <Label>{c('Label').t`Phone number`}</Label>
                <Field className="mr1">
                    <TelInput value={phone} onChange={handleChangePhone} placeholder="(201) 555-0123" />
                </Field>
            </Row>
            <PrimaryButton disabled={!phone} loading={loading} onClick={handleSendClick}>{c('Action')
                .t`Send`}</PrimaryButton>
        </>
    );
};

VerificationPhoneInput.propTypes = {
    onSendClick: PropTypes.func.isRequired,
    loading: PropTypes.bool
};

export default VerificationPhoneInput;
