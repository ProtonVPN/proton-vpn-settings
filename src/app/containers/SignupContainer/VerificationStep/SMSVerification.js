import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Bordered, Block, useNotifications, InlineLinkButton, useLoading } from 'react-components';
import { c } from 'ttag';
import PhoneInput from './PhoneInput';
import VerificationInput from './VerificationInput';

const SMSVerification = ({ verify, requestCode }) => {
    const { createNotification } = useNotifications();

    const [phone, setPhone] = useState('');
    const [codeLoading, withLoadingCode] = useLoading();
    const [verifyLoading, withLoadingVerify] = useLoading();

    const handleSendClick = async (phone) => {
        await withLoadingCode(requestCode(phone));
        createNotification({ text: c('Notification').jt`Verification code sent to: ${phone}` });
        setPhone(phone);
    };

    const handleResendClick = async () => {
        await withLoadingCode(requestCode(phone));
        createNotification({ text: c('Notification').jt`New code sent to: ${phone}` });
    };

    const handleVerifyClick = (code) => withLoadingVerify(verify(phone, code));

    if (phone) {
        return (
            <Bordered>
                <Block>{c('Info').t`Please check your phone and enter the code we sent you`}</Block>
                <Block>{c('Info').jt`The verification sms is on it's way to ${<strong>{phone}</strong>}`}</Block>
                <VerificationInput isLoading={verifyLoading} onVerify={handleVerifyClick} />

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

SMSVerification.propTypes = {
    verify: PropTypes.func.isRequired,
    requestCode: PropTypes.func.isRequired
};

export default SMSVerification;
