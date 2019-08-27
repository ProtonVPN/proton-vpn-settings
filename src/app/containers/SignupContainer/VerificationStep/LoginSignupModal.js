import React from 'react';
import PropTypes from 'prop-types';
import { Alert, Block, DialogModal, HeaderModal, InnerModal, FooterModal, PrimaryButton } from 'react-components';
import { c } from 'ttag';
import LoginForm from 'react-components/containers/login/LoginForm';

// TODO: reuse signup container logic (hook?)
const LoginSignupModal = ({ onClose, ...rest }) => {
    const modalTitleID = 'loginSignupModal';
    return (
        <DialogModal modalTitleID={modalTitleID} {...rest}>
            <HeaderModal modalTitleID={modalTitleID} onClose={onClose}>
                {c('Title').t`Login to ProtonVPN`}
            </HeaderModal>
            <div className="pm-modalContent">
                <InnerModal>
                    <Alert>{c('Info').t`An account already exists with this email address`}</Alert>
                    <Block>{c('Info').t`ProtonMail and ProtonVPN share the same login information`}</Block>
                    <LoginForm />
                </InnerModal>
                <FooterModal>
                    <PrimaryButton>{c('Action').t`Login`}</PrimaryButton>
                </FooterModal>
            </div>
        </DialogModal>
    );
};

LoginSignupModal.propTypes = {
    onClose: PropTypes.func.isRequired
};

export default LoginSignupModal;
