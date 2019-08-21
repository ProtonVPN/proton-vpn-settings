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
    useApiResult,
    useNotifications
} from 'react-components';
import { c } from 'ttag';
import { queryEmailVerificationCode } from '../../../../../../proton-shared/lib/api/user';
import SMSVerification from './SMSVerification';
import EmailVerification from './EmailVerification';

// TODO: dynamic phone number placeholder (probably should come from TelInput)
const VerificationStep = ({ email }) => {
    const { loading } = useApiResult(() => queryEmailVerificationCode(email), []);

    const doNotClose = <strong>{c('Warning').t`Do not close`}</strong>;

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

            <EmailVerification isLoading={loading} email={email} />

            <SMSVerification />
        </>
    );
};

VerificationStep.propTypes = {
    email: PropTypes.string.isRequired
};

export default VerificationStep;
