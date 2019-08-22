import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { SubTitle, Input, Label, Field, Alert, Block, EmailInput } from 'react-components';
import { c } from 'ttag';
import { Link } from 'react-router-dom';

// TODO: validate and 'success into error' handling
const EmailSection = ({ onEnterEmail, onContinue }) => {
    const [email, setEmail] = useState('');

    const handleChangeEmail = ({ target }) => setEmail(target.value);
    const handleBlur = () => email && onEnterEmail(email);
    const handleSubmit = () => {
        if (email) {
            onEnterEmail(email);
            onContinue(email);
        }
    };

    const loginLink = <Link to="/login">{c('Link').t`log in with ProtonMail account`}</Link>;

    return (
        <>
            <SubTitle>{c('Title').t`2. Enter your email`}</SubTitle>
            <Alert>{c('Info')
                .t`Your email is not shared with third parties and is only used for account-related questions, communication, and recovery.
                    You can manage your email preferences in the "Account" tab in your dashboard.`}</Alert>
            <Label htmlFor="email">{c('Label').t`Email`}</Label>
            <Block>
                <Field>
                    <EmailInput
                        value={email}
                        onChange={handleChangeEmail}
                        onBlur={handleBlur}
                        onPressEnter={handleSubmit}
                        placeholder={c('Placeholder').t`name@example.com`}
                    />
                </Field>
            </Block>
            <span>{c('Info').jt`or ${loginLink}`}</span>
        </>
    );
};

EmailSection.propTypes = {
    onEnterEmail: PropTypes.func.isRequired,
    onContinue: PropTypes.func.isRequired
};

export default EmailSection;
