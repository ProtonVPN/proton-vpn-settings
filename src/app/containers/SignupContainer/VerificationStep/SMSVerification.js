import React, { useState } from 'react';
import {
    Bordered,
    Block,
    useApiWithoutResult,
    useNotifications,
    InlineLinkButton,
    useApiResult
} from 'react-components';
import { c } from 'ttag';
import PhoneInput from './PhoneInput';
import { querySMSVerificationCode, queryCheckVerificationCode } from 'proton-shared/lib/api/user';
import VerificationInput from './VerificationInput';

const SMSVerification = () => {
    const { createNotification } = useNotifications();
    const [phone, setPhone] = useState('');
    const { loading: codeLoading, request: requestCode } = useApiWithoutResult((phone) =>
        querySMSVerificationCode(phone)
    );
    const { loading: verifyLoading, request: requestVerification } = useApiResult((code) =>
        queryCheckVerificationCode(code, 'sms', 1)
    );

    const handleSendClick = async (phone) => {
        await requestCode(phone);
        setPhone(phone);
        createNotification({ text: c('Notification').jt`Verification code sent to: ${phone}` });
    };

    const handleResendClick = async () => {
        await requestCode(phone);
        createNotification({ text: c('Notification').jt`New code sent to: ${phone}` });
    };

    const handleValidateClick = async (code) => {
        await requestVerification(`${phone}:${code}`);
        // TODO: redirect to account setup
    };

    const phoneText = <strong>{phone}</strong>;

    if (phone) {
        return (
            <Bordered>
                <Block>{c('Info').t`Please check your phone and enter the code we sent you`}</Block>
                <Block>{c('Info').jt`The verification sms is on it's way to ${phoneText}`}</Block>
                <VerificationInput isLoading={verifyLoading} onValidate={handleValidateClick} />

                <div className="flex-items-center flex">
                    {c('Info').t`Didn't receive the sms?`}
                    <InlineLinkButton onClick={handleResendClick} disabled={codeLoading} className="ml0-25">{c('Action')
                        .t`Resend`}</InlineLinkButton>
                </div>
            </Bordered>
        );
    }

    return (
        <Bordered>
            <Block>{c('Info').t`Verify your account with a code sent via SMS`}</Block>
            <PhoneInput loading={codeLoading} onSendClick={handleSendClick} />
        </Bordered>
    );
};

export default SMSVerification;
