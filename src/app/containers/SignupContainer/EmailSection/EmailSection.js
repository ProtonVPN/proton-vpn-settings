import React from 'react';
import { SubTitle, Input, Label, Field, Alert, Block } from 'react-components';
import { c } from 'ttag';
import { Link } from 'react-router-dom';

const EmailSection = () => {
    return (
        <>
            <SubTitle>{c('Title').t`Enter your email`}</SubTitle>
            <Alert>{c('Info')
                .t`Your email is not shared with third parties and is only used for account-related questions, communication, and recovery.
                    You can manage your email preferences in the "Account" tab in your dashboard.`}</Alert>
            <Label htmlFor="email">{c('Label').t`Email`}</Label>
            <Block>
                <Field>
                    <Input id="email" placeholder={c('Placeholder').t`name@example.com`} />
                </Field>
            </Block>
            <span>{c('Info').jt`or ${<Link to="/login">{c('Link').t`log in with ProtonMail account`}</Link>}`}</span>
        </>
    );
};

export default EmailSection;
