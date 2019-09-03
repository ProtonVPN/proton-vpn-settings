import React from 'react';
import PropTypes from 'prop-types';
import { PrimaryButton, Price } from 'react-components';
import { c } from 'ttag';

const UpgradeCTA = ({ onUpgrade, basicPlan, currency }) => {
    return (
        <PrimaryButton className="w100" onClick={onUpgrade}>{c('Action').jt`Upgrade to basic for ${(
            <Price currency={currency}>{basicPlan.price.totalMonthly}</Price>
        )} / month`}</PrimaryButton>
    );
};

UpgradeCTA.propTypes = {
    currency: PropTypes.string.isRequired,
    basicPlan: PropTypes.object.isRequired,
    onUpgrade: PropTypes.func.isRequired
};

export default UpgradeCTA;
