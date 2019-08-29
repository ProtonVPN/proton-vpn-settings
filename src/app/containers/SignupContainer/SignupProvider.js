import React, { useState, createContext } from 'react';
import PropTypes from 'prop-types';
import { PLANS, DEFAULT_CURRENCY, CYCLE } from 'proton-shared/lib/constants';
import { queryDirectSignupStatus } from 'proton-shared/lib/api/user';
import { useApiResult, useConfig, usePlans } from 'react-components';
import { withRouter } from 'react-router-dom';

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

const SignupProvider = ({ children, onLogin, history }) => {
    const { CLIENT_TYPE } = useConfig();
    const { result } = useApiResult(() => queryDirectSignupStatus(CLIENT_TYPE), []);

    const [plans = []] = usePlans();
    const currency = plans[0] ? plans[0].Currency : DEFAULT_CURRENCY;
    const invite = history.location.state;

    const [model, setModel] = useState({
        planName: PLANS.FREE, // TODO: can set from query params
        cycle: CYCLE.YEARLY,
        email: '',
        inviteToken: invite && `${invite.selector}:${invite.token}`,
        verificationToken: null,
        paymentDetails: null,
        appliedCoupon: null,
        appliedGiftCode: null,
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
    history: PropTypes.shape({
        location: PropTypes.shape({
            state: PropTypes.shape({
                selector: PropTypes.string.isRequired,
                token: PropTypes.string.isRequired
            })
        }).isRequired
    }).isRequired
};

export default withRouter(SignupProvider);
