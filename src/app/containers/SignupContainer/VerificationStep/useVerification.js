import React from 'react';
import { useConfig, useModals, useApiResult } from 'react-components';
import {
    queryCheckVerificationCode,
    queryEmailVerificationCode,
    querySMSVerificationCode
} from 'proton-shared/lib/api/user';
import LoginSignupModal from './LoginSignupModal';
import { useEffect } from 'react';

const useVerification = (onLogin) => {
    const { createModal } = useModals();
    const { CLIENT_TYPE } = useConfig();
    const { error: emailCodeError, request: requestEmailCode } = useApiResult((email) =>
        queryEmailVerificationCode(email)
    );
    const { error: emailVerificationError, request: requestEmailVerification } = useApiResult((token) =>
        queryCheckVerificationCode(token, 'email', CLIENT_TYPE)
    );
    const { error: smsCodeError, request: requestSMSCode } = useApiResult((email) => querySMSVerificationCode(email));
    const { error: smsVerificationError, request: requestSMSVerification } = useApiResult((token) =>
        queryCheckVerificationCode(token, 'sms', CLIENT_TYPE)
    );

    useEffect(() => {
        // Existing protonmail account
        if (emailCodeError && emailCodeError.data.Code === 12220) {
            createModal(<LoginSignupModal onLogin={onLogin} />);
        }
    }, [emailCodeError]);

    const verifyEmail = async (email, code) => {
        const Token = `${email}:${code}`;
        await requestEmailVerification(Token);
        return { Token, TokenType: 'email' };
    };

    const verifySMS = async (phone, code) => {
        const Token = `${phone}:${code}`;
        await requestSMSVerification(Token);
        return { Token, TokenType: 'sms' };
    };

    return {
        requestEmailCode,
        requestSMSCode,
        verifyEmail,
        verifySMS,
        emailCodeError,
        emailVerificationError,
        smsCodeError,
        smsVerificationError
    };
};

export default useVerification;
