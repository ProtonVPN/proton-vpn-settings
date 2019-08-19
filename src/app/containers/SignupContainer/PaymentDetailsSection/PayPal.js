import React from 'react';
import PropTypes from 'prop-types';
import { Alert } from 'react-components';
import AddCoupon from './AddCoupon';
import UseGiftCode from './UseGiftCode';
import { c } from 'ttag';
import Confirmation from './Confirmation';

// TODO: import image from design system
// TODO: confirmation/submit
const PayPal = ({ onContinue }) => {
    return (
        <>
            <Alert>
                <div className="flex">
                    <img className="mr1" width={100} src="https://account.protonvpn.com/assets/paypal.svg" />
                    <div className="flex-item-fluid">
                        {c('Info')
                            .t`You will need to login to your PayPal account to complete this transaction. We will open a new
                        tab with PayPal for you. If you use any pop-up blockers, please disable them to continue.`}
                    </div>
                </div>
            </Alert>
            <div className="flex mb0-5">
                <AddCoupon />
                <UseGiftCode />
            </div>
            <Confirmation action={c('Action').t`Continue With PayPal`} onConfirm={onContinue} />
        </>
    );
};

PayPal.propTypes = {
    onContinue: PropTypes.func.isRequired
};

export default PayPal;
