import React from 'react';
import PropTypes from 'prop-types';
import AccountForm from './AccountForm';
import { Row } from 'react-components';

const AccountStep = ({ onContinue, model, children }) => {
    const handleSubmit = ({ email, username, password }) => onContinue({ ...model, email, username, password });

    return (
        <Row>
            <AccountForm onSubmit={handleSubmit} />
            {children}
        </Row>
    );
};

AccountStep.propTypes = {
    model: PropTypes.object.isRequired,
    onContinue: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired
};

export default AccountStep;
