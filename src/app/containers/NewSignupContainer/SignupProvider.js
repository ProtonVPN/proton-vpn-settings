import React, { useState, createContext } from 'react';
import PropTypes from 'prop-types';
import { PLANS, DEFAULT_CURRENCY, CYCLE } from 'proton-shared/lib/constants';
import { queryDirectSignupStatus } from 'proton-shared/lib/api/user';
import { useApiResult, useConfig, usePlans } from 'react-components';
import { withRouter } from 'react-router-dom';

export const SignupContext = createContext(null);

const DEFAULT_PLAN = PLANS.FREE;

const getSignupAvailability = (isDirectSignupEnabled, allowedMethods = []) => {
    const email = allowedMethods.includes('email');
    const sms = allowedMethods.includes('sms');
    const paid = allowedMethods.includes('payment');
    const free = email || sms;

    return {
        allowedMethods,
        inviteOnly: !isDirectSignupEnabled || (!free && !paid),
        email,
        free,
        sms,
        paid
    };
};

const SignupProvider = ({ children, onLogin, location }) => {
    const { CLIENT_TYPE } = useConfig();
    const { result } = useApiResult(() => queryDirectSignupStatus(CLIENT_TYPE), []);

    const [plans = []] = usePlans();
    const currency = plans[0] ? plans[0].Currency : DEFAULT_CURRENCY;
    const searchParams = new URLSearchParams(location.search);
    const initialPlan = searchParams.get('plan') || DEFAULT_PLAN;

    const [model, setModel] = useState({
        planName: initialPlan,
        cycle: CYCLE.YEARLY,
        email: '',
        username: '',
        password: '',
        currency
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
    children: PropTypes.node.isRequired,
    location: PropTypes.shape({
        search: PropTypes.string.isRequired
    }).isRequired
};

export default withRouter(SignupProvider);
