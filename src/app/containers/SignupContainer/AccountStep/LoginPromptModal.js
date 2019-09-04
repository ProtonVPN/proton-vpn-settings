import React from 'react';
import PropTypes from 'prop-types';
import { FormModal, PrimaryButton } from 'react-components';
import { c } from 'ttag';
import { Link } from 'react-router-dom';

// TODO: make it more generic (title, login url)
const LoginPromptModal = ({ email, ...rest }) => {
    return (
        <FormModal
            title={c('Title').t`ProtonVPN`}
            close={c('Action').t`Cancel`}
            submit={
                <Link to="/login">
                    <PrimaryButton>{c('Action').t`Go to login`}</PrimaryButton>
                </Link>
            }
            {...rest}
        >
            <p>{c('Info').t`You already have a Proton account.`}</p>
            <p>{c('Info')
                .t`Your existing Proton account can be used to access all Proton services. Please login with ${email}`}</p>
        </FormModal>
    );
};

LoginPromptModal.propTypes = {
    email: PropTypes.string.isRequired
};

export default LoginPromptModal;
