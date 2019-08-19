import React from 'react';
import { LinkButton } from 'react-components';
import { c } from 'ttag';

const UseGiftCode = () => {
    return <LinkButton className="mr1">{c('Action').t`Use gift code`}</LinkButton>;
};

export default UseGiftCode;
