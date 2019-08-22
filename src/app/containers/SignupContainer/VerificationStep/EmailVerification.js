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

const EmailVerification = ({ email, isLoading, onVerificationDone }) => {
    const { createNotification } = useNotifications();
    const { loading: resendLoading, request: requestCode } = useApiWithoutResult(() =>
        queryEmailVerificationCode(email)
    );
    const { loading: verifyLoading, request: requestVerification } = useApiResult((code) =>
        queryCheckVerificationCode(code, 'email', 1)
    );

    // TODO: debounce maybe
    const handleResendClick = async () => {
        await requestCode();
        createNotification({ text: c('Notification').jt`New code sent to: ${email}` });
    };

    const handleValidateClick = async (code) => {
        await requestVerification(`${email}:${code}`);
        onVerificationDone();
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
            <VerificationInput isLoading={isLoading || verifyLoading} onValidate={handleValidateClick} />

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
    isLoading: PropTypes.bool,
    onVerificationDone: PropTypes.func.isRequired
};

export default EmailVerification;
