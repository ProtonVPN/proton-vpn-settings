import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'react-components';
import { c } from 'ttag';
import Confirmation from './Confirmation';

const CreditCard = ({ onContinue }) => {
    return (
        <>
            <Card card={{}} errors={{}} />
            <Confirmation action={c('Action').t`Confirm Payment`} onConfirm={onContinue} />
        </>
    );
};

CreditCard.propTypes = {
    onContinue: PropTypes.func.isRequired
};

export default CreditCard;
