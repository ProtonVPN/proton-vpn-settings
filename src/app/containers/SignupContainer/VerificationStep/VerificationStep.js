import React from 'react';
import PropTypes from 'prop-types';
import {
    Title,
    Alert,
    Bordered,
    Row,
    Input,
    PrimaryButton,
    Field,
    TelInput,
    Block,
    InlineLinkButton,
    useApiResult
} from 'react-components';
import { c } from 'ttag';
import { queryEmailVerificationCode } from '../../../../../../proton-shared/lib/api/user';

// TODO: dynamic phone number placeholder (probably should come from TelInput)
const VerificationStep = ({ email }) => {
    useApiResult(() => queryEmailVerificationCode(email), []);

    const doNotClose = <strong>{c('Warning').t`Do not close`}</strong>;
    const emailText = <strong>{email}</strong>;
    const resendButton = <InlineLinkButton className="ml0-25">{c('Action').t`resend`}</InlineLinkButton>;

    return (
        <>
            <Title>{c('Title').t`Please verify your account`}</Title>
            <p>{c('Info').t`You are a few steps away from taking back control of your privacy and security.`}</p>
            <Alert>
                {c('Info')
                    .t`In order to prevent abuse and provide the best possible user experience, we need to verify your
                    account.`}
            </Alert>
            <Alert type="warning">
                {c('Warning').jt`${doNotClose} this page as it may take a moment for you to receive the verification
                code.`}
                <br />
                <i>{c('Warning').t`You might want to check the spam folder as well.`}</i>
            </Alert>

            <Bordered>
                <Block>{c('Info').t`Please check your email and enter the code below`}</Block>
                <Block>{c('Info').jt`The verification email is on it's way to ${emailText}`}</Block>
                <Row>
                    <Field className="mr1">
                        <Input placeholder={c('Placeholder').t`Verification code`} />
                    </Field>
                    <PrimaryButton>{c('Action').t`Validate`}</PrimaryButton>
                </Row>

                <div className="flex-items-center flex">
                    {c('Info').t`Didn't receive an email?`}
                    <strong className="flex-items-center flex ml0-25">{c('Info')
                        .jt`Check your spam folder or ${resendButton}`}</strong>
                </div>
            </Bordered>

            <Bordered>
                <Block>{c('Info').t`Verify your account with a code sent via SMS`}</Block>
                <Row>
                    <Field className="mr1">
                        <TelInput placeholder="(201) 555-0123" />
                    </Field>
                    <PrimaryButton>{c('Action').t`Send`}</PrimaryButton>
                </Row>
            </Bordered>
        </>
    );
};

VerificationStep.propTypes = {
    email: PropTypes.string.isRequired
};

export default VerificationStep;
