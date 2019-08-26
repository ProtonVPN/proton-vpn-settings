import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Title, Alert, useApiResult, Href, InlineLinkButton } from 'react-components';
import { c } from 'ttag';
import { queryEmailVerificationCode } from '../../../../../../proton-shared/lib/api/user';
import SMSVerification from './SMSVerification';
import EmailVerification from './EmailVerification';

// TODO: dynamic phone number placeholder (probably should come from TelInput)
const VerificationStep = ({ email, onVerificationDone, onChangeEmail }) => {
    const [showSupport, setShowSupport] = useState(false);
    // TODO: if email allowed
    const { error } = useApiResult(() => queryEmailVerificationCode(email), []);

    const handleError = () => setShowSupport(true);
    const handleInvitation = () => {
        console.log('invite'); // TODO: implement - modal or separate route/link
    };

    const doNotClose = <strong>{c('Warning').t`Do not close`}</strong>;
    const supportLink = <Href url="https://protonvpn.com/support-form">{c('Link').t`support team`}</Href>; // TODO: relative url
    const invitationLink = (
        <InlineLinkButton onClick={handleInvitation} title="Request an invitation">{c('Link')
            .t`manual confirmation`}</InlineLinkButton>
    );

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

            {(error || showSupport) && (
                <Alert type="error">{c('Info')
                    .jt`Any issues during the verification? Please contact the ${supportLink} or request ${invitationLink}.`}</Alert>
            )}

            <EmailVerification
                onError={handleError}
                onVerificationDone={onVerificationDone}
                onChangeEmail={onChangeEmail}
                email={email}
            />

            <SMSVerification onError={handleError} onVerificationDone={onVerificationDone} />
        </>
    );
};

VerificationStep.propTypes = {
    email: PropTypes.string.isRequired,
    onVerificationDone: PropTypes.func.isRequired,
    onChangeEmail: PropTypes.func.isRequired
};

export default VerificationStep;
