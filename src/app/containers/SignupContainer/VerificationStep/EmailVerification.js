import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Bordered, Block, InlineLinkButton, useNotifications, useLoading } from 'react-components';
import { c } from 'ttag';
import VerificationInput from './VerificationInput';
import VerificationEmailInput from './VerificationEmailInput';
import useSignup from '../useSignup';

const EmailVerification = ({ verify, requestCode, requireEmailChange }) => {
    const { createNotification } = useNotifications();

    const [codeLoading, withLoadingCode] = useLoading();
    const [verifyLoading, withLoadingVerify] = useLoading();
    const {
        model: { email },
        updateModel
    } = useSignup();

    useEffect(() => {
        withLoadingCode(requestCode(email));
    }, []);

    const handleSendClick = async (email) => {
        await withLoadingCode(requestCode(email));
        createNotification({ text: c('Notification').jt`Verification code sent to: ${email}` });
        updateModel({ email });
    };

    // TODO: resend timer
    const handleResendClick = async () => {
        await withLoadingCode(requestCode(email));
        createNotification({ text: c('Notification').jt`New code sent to: ${email}` });
    };

    const handleVerifyClick = (code) => withLoadingVerify(verify(email, code));

    const resendButton = (
        <InlineLinkButton onClick={handleResendClick} disabled={codeLoading} className="ml0-25">{c('Action')
            .t`resend`}</InlineLinkButton>
    );

    if (requireEmailChange) {
        return (
            <Bordered>
                <Block>{c('Info')
                    .t`We are having trouble sending verification code, you can try a different email.`}</Block>
                <VerificationEmailInput loading={codeLoading} onSendClick={handleSendClick} />
            </Bordered>
        );
    }

    return (
        <Bordered>
            <Block>{c('Info').t`Please check your email and enter the code below`}</Block>
            <Block>{c('Info').jt`The verification email is on it's way to ${<strong>{email}</strong>}`}</Block>
            <VerificationInput isLoading={verifyLoading} onVerify={handleVerifyClick} />

            <div className="flex-items-center flex">
                {c('Info').t`Didn't receive the email?`}
                <strong className="flex-items-center flex ml0-25">{c('Info')
                    .jt`Check your spam folder or ${resendButton}`}</strong>
            </div>
        </Bordered>
    );
};

EmailVerification.propTypes = {
    verify: PropTypes.func.isRequired,
    requestCode: PropTypes.func.isRequired,
    requireEmailChange: PropTypes.bool.isRequired
};

export default EmailVerification;
