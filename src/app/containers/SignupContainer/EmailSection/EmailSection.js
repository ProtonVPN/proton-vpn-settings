import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { SubTitle, Input, Label, Field, Alert, Block } from 'react-components';
import { c } from 'ttag';
import { Link } from 'react-router-dom';

// TODO: validate and 'success into error' handling
const EmailSection = ({ onEnterEmail }) => {
    const [email, setEmail] = useState('');

    const handleChangeEmail = ({ target }) => setEmail(target.value);
    const handleBlur = () => email && onEnterEmail();

    return (
        <>
            <SubTitle>{c('Title').t`2. Enter your email`}</SubTitle>
            <Alert>{c('Info')
                .t`Your email is not shared with third parties and is only used for account-related questions, communication, and recovery.
                    You can manage your email preferences in the "Account" tab in your dashboard.`}</Alert>
            <Label htmlFor="email">{c('Label').t`Email`}</Label>
            <Block>
                <Field>
                    <Input
                        value={email}
                        onChange={handleChangeEmail}
                        onBlur={handleBlur}
                        id="email"
                        placeholder={c('Placeholder').t`name@example.com`}
                    />
                </Field>
            </Block>
            <span>{c('Info').jt`or ${<Link to="/login">{c('Link').t`log in with ProtonMail account`}</Link>}`}</span>
        </>
    );
};

EmailSection.propTypes = {
    onEnterEmail: PropTypes.func.isRequired
};

export default EmailSection;
