import React, { useState, createContext } from 'react';
import PropTypes from 'prop-types';
import { PLANS, DEFAULT_CURRENCY } from 'proton-shared/lib/constants';

export const SignupContext = createContext(null);

const SignupProvider = ({ children }) => {
    const [model, setModel] = useState({
        planName: PLANS.FREE, // TODO: can set from query params
        currency: DEFAULT_CURRENCY,
        isAnnual: true,
        email: '',
        verificationToken: null,
        paymentDetails: null
    });

    return <SignupContext.Provider value={[model, setModel]}>{children}</SignupContext.Provider>;
};

SignupProvider.propTypes = {
    children: PropTypes.node.isRequired
};

export default SignupProvider;
