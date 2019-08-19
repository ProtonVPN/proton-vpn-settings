import React from 'react';
import { LinkButton } from 'react-components';
import { c } from 'ttag';

const AddCoupon = () => {
    return <LinkButton className="mr1">{c('Action').t`Add coupon`}</LinkButton>;
};

export default AddCoupon;
