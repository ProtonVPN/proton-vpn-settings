import React from 'react';
import { Title, SubTitle, Input, PasswordInput, PrimaryButton, Field, Alert, Block } from 'react-components';
import { c } from 'ttag';

const AccountStep = () => {
    return (
        <>
            <Title>{c('Title').t`Complete account set-up`}</Title>
            <Block>
                <SubTitle>{c('Title').t`1. Choose your username`}</SubTitle>
                <Alert>{c('Info').t`Your username can be used for ProtonMail account`}</Alert>
                <Field>
                    <Input name="username" />
                </Field>
            </Block>

            <Block>
                <SubTitle>{c('Title').t`2. Create your password`}</SubTitle>
                <Alert>{c('Info').t`Use 8 or more characters with a mix of letters, numbers & symbols`}</Alert>
                <Field>
                    <PasswordInput name="password" />
                </Field>
            </Block>

            <Field>
                <PrimaryButton>{c('Action').t`Complete`}</PrimaryButton>
            </Field>
        </>
    );
};

AccountStep.propTypes = {};

export default AccountStep;
