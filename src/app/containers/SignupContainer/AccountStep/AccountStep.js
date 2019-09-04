import React from 'react';
import PropTypes from 'prop-types';
import AccountForm from './AccountForm';
import { Row, SubTitle } from 'react-components';
import { c } from 'ttag';

const AccountStep = ({ onContinue, model, children }) => {
    const handleSubmit = ({ email, username, password }) => onContinue({ ...model, email, username, password });

    return (
        <>
            <SubTitle>{c('Title').t`Create an account`}</SubTitle>
            <Row>
                <AccountForm onSubmit={handleSubmit} />
                {children}
            </Row>
        </>
    );
};

AccountStep.propTypes = {
    model: PropTypes.object.isRequired,
    onContinue: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired
};

export default AccountStep;
