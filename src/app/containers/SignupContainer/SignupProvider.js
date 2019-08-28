import React, { useState, createContext } from 'react';
import PropTypes from 'prop-types';
import { PLANS, DEFAULT_CURRENCY, CYCLE } from 'proton-shared/lib/constants';
import { queryDirectSignupStatus } from 'proton-shared/lib/api/user';
import { useApiResult, useConfig } from 'react-components';

export const SignupContext = createContext(null);

const getSignupAvailability = (isDirectSignupEnabled, allowedMethods = []) => {
    const email = allowedMethods.includes('email');
    const sms = allowedMethods.includes('sms');
    const paid = allowedMethods.includes('payment');
    const free = email || sms;

    return {
        inviteOnly: !isDirectSignupEnabled || (!free && !paid),
        email,
        free,
        sms,
        paid
    };
};

const SignupProvider = ({ children, onLogin }) => {
    const { CLIENT_TYPE } = useConfig();
    const { result } = useApiResult(() => queryDirectSignupStatus(CLIENT_TYPE), []);
    const [model, setModel] = useState({
        planName: PLANS.FREE, // TODO: can set from query params
        currency: DEFAULT_CURRENCY,
        cycle: CYCLE.YEARLY,
        email: '',
        verificationToken: null,
        paymentDetails: null
    });

    return (
        <SignupContext.Provider
            value={[
                model,
                setModel,
                {
                    onLogin,
                    signupAvailability: result && getSignupAvailability(result.Direct, result.VerifyMethods)
                }
            ]}
        >
            {children}
        </SignupContext.Provider>
    );
};

SignupProvider.propTypes = {
    onLogin: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired
};

export default SignupProvider;
