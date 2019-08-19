import React, { useState } from 'react';
import { LinkButton, Input, Button } from 'react-components';
import { c } from 'ttag';

const AddCoupon = () => {
    const [isEditing, setEditing] = useState(false);

    const handleClickEdit = () => setEditing(true);

    if (isEditing) {
        return (
            <div className="flex mr1">
                <Input className="flex-item-fluid mr0-5" placeholder={c('Placeholder').t`Coupon`} />
                <Button>{c('Action').t`Apply`}</Button>
            </div>
        );
    }

    return <LinkButton onClick={handleClickEdit} className="mr1">{c('Action').t`Add coupon`}</LinkButton>;
};

export default AddCoupon;
