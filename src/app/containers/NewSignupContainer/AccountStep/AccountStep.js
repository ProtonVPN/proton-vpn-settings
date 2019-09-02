import React from 'react';
import PropTypes from 'prop-types';
import useSignup from '../useSignup';
import AccountForm from './AccountForm';
import SelectedPlan from '../SelectedPlan';
import { Row } from 'react-components';

const AccountStep = ({ onContinue }) => {
    const { updateModel } = useSignup();

    const handleSubmit = ({ email, password, username }) => {
        updateModel({ email, password, username });
        onContinue();
    };

    return (
        <Row>
            <AccountForm onSubmit={handleSubmit} />
            <SelectedPlan />
        </Row>
    );
};

AccountStep.propTypes = {
    onContinue: PropTypes.func.isRequired
};

export default AccountStep;
