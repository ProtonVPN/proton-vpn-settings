import React from 'react';
import PropTypes from 'prop-types';
import { Alert, Block, DialogModal, LoginForm, HeaderModal } from 'react-components';
import { c } from 'ttag';
import { withRouter } from 'react-router-dom';

const LoginSignupModal = ({ onClose, onLogin, history, ...rest }) => {
    const modalTitleID = 'loginSignupModal';

    const handleLogin = (...args) => {
        history.push('/dashboard');
        onLogin(...args);
    };

    return (
        <DialogModal modalTitleID={modalTitleID} {...rest}>
            <HeaderModal modalTitleID={modalTitleID} onClose={onClose}>
                {c('Title').t`Login to ProtonVPN`}
            </HeaderModal>
            <div className="pm-modalContent p2">
                <Alert>{c('Info').t`An account already exists with this email address`}</Alert>
                <Block>{c('Info').t`ProtonMail and ProtonVPN share the same login information`}</Block>
                <LoginForm onLogin={handleLogin} />
            </div>
        </DialogModal>
    );
};

LoginSignupModal.propTypes = {
    history: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    onLogin: PropTypes.func.isRequired
};

export default withRouter(LoginSignupModal);
