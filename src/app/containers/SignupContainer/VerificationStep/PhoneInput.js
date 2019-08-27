import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Field, Row, PrimaryButton, TelInput } from 'react-components';
import { c } from 'ttag';

const PhoneInput = ({ onSendClick, loading }) => {
    const [phone, setPhone] = useState('');

    const handleChangePhone = ({ target }) => setPhone(target.value);
    const handleSendClick = () => onSendClick(phone);

    return (
        <Row>
            <Field className="mr1">
                <TelInput value={phone} onChange={handleChangePhone} placeholder="(201) 555-0123" />
            </Field>
            <div>
                <PrimaryButton loading={loading} onClick={handleSendClick}>{c('Action').t`Send`}</PrimaryButton>
            </div>
        </Row>
    );
};

PhoneInput.propTypes = {
    onSendClick: PropTypes.func.isRequired,
    loading: PropTypes.bool
};

export default PhoneInput;
