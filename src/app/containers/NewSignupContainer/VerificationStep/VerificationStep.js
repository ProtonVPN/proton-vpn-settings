import React from 'react';
import PropTypes from 'prop-types';
import { Row, Alert } from 'react-components';
import VerificationForm from './VerificationForm/VerificationForm';
import useSignup from '../useSignup';
import useVerification from './useVerification';
import SelectedPlan from '../SelectedPlan';
import { c } from 'ttag';

const VerificationStep = ({ onVerificationDone }) => {
    const { verify, requestCode } = useVerification();
    const {
        model: { email },
        updateModel,
        signupAvailability
    } = useSignup();

    const handleSubmit = async (code, params) => {
        const newEmail = params.Destination.Address;

        if (newEmail && newEmail !== email) {
            updateModel({ email: newEmail });
        }

        const verificationToken = await verify(code, params);
        onVerificationDone(verificationToken);
    };

    return (
        <>
            <Row>
                <Alert>
                    {c('Info')
                        .t`In order to prevent abuse and provide the best possible user experience, we need to verify your
                    account.`}
                </Alert>
                <VerificationForm
                    allowedMethods={signupAvailability.allowedMethods}
                    defaultEmail={email}
                    onRequestCode={requestCode}
                    onSubmit={handleSubmit}
                />
                <SelectedPlan />
            </Row>
        </>
    );
};

VerificationStep.propTypes = {
    onVerificationDone: PropTypes.func.isRequired
};

export default VerificationStep;
