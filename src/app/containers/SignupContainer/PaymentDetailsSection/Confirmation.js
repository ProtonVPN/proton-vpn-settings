import React from 'react';
import PropTypes from 'prop-types';
import { Href, PrimaryButton } from 'react-components';
import { c } from 'ttag';

const Confirmation = ({ onConfirm, action }) => {
    const tosLink = <Href url="https://protonvpn.com/terms-and-conditions">{c('Link').t`Terms of Service`}</Href>;
    const policyLink = <Href url="https://protonvpn.com/privacy-policy">{c('Link').t`Privacy Policy`}</Href>;
    return (
        <>
            <hr />
            <div className="flex flex-items-center">
                <div className="flex-item-fluid mr1">
                    {c('Info').jt`By clicking this button, you agree to abide by our ${tosLink} and ${policyLink}`}
                </div>
                <div>
                    <PrimaryButton onClick={onConfirm}>{action}</PrimaryButton>
                </div>
            </div>
        </>
    );
};

Confirmation.propTypes = {
    action: PropTypes.string.isRequired,
    onConfirm: PropTypes.func.isRequired
};

export default Confirmation;
