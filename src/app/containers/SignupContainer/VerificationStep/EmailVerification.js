import React from 'react';
import PropTypes from 'prop-types';
import {
    Bordered,
    Block,
    InlineLinkButton,
    useNotifications,
    useApiWithoutResult,
    useApiResult
} from 'react-components';
import { c } from 'ttag';
import { queryEmailVerificationCode, queryCheckVerificationCode } from 'proton-shared/lib/api/user';
import VerificationInput from './VerificationInput';

// TODO: dedup verification logic (hook? move to container?)
const EmailVerification = ({ email, onVerificationDone }) => {
    const { createNotification } = useNotifications();
    const { loading: resendLoading, request: requestCode } = useApiWithoutResult(() =>
        queryEmailVerificationCode(email)
    );
    const { loading: verifyLoading, request: requestVerification } = useApiResult(({ Token, TokenType }) =>
        queryCheckVerificationCode(Token, TokenType, 2)
    );

    // TODO: debounce maybe
    const handleResendClick = async () => {
        await requestCode();
        createNotification({ text: c('Notification').jt`New code sent to: ${email}` });
    };

    const handleValidateClick = async (code) => {
        const tokenData = { Token: `${email}:${code}`, TokenType: 'email' };
        await requestVerification(tokenData);
        onVerificationDone(tokenData);
    };

    const emailText = <strong>{email}</strong>;
    const resendButton = (
        <InlineLinkButton onClick={handleResendClick} disabled={resendLoading} className="ml0-25">{c('Action')
            .t`resend`}</InlineLinkButton>
    );

    return (
        <Bordered>
            <Block>{c('Info').t`Please check your email and enter the code below`}</Block>
            <Block>{c('Info').jt`The verification email is on it's way to ${emailText}`}</Block>
            <VerificationInput isLoading={verifyLoading} onValidate={handleValidateClick} />

            <div className="flex-items-center flex">
                {c('Info').t`Didn't receive the email?`}
                <strong className="flex-items-center flex ml0-25">{c('Info')
                    .jt`Check your spam folder or ${resendButton}`}</strong>
            </div>
        </Bordered>
    );
};

EmailVerification.propTypes = {
    email: PropTypes.string.isRequired,
    onVerificationDone: PropTypes.func.isRequired
};

export default EmailVerification;
