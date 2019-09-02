import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Row, Field, Input, PrimaryButton, Label, InlineLinkButton, useLoading } from 'react-components';
import { c } from 'ttag';

const VerificationCodeForm = ({ onSubmit, onResend }) => {
    const [loading, withLoading] = useLoading();
    const [code, setCode] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        withLoading(onSubmit(code));
    };
    const handleChangeCode = ({ target }) => setCode(target.value);

    return (
        <div>
            <Row className="flex-spacebetween">
                <h3>{c('Title').t`Enter verification code`}</h3>
                <InlineLinkButton onClick={onResend}>{c('Info').t`Didn't receive the code?`}</InlineLinkButton>
            </Row>
            <form onSubmit={handleSubmit}>
                <Row>
                    <Label htmlFor="code">{c('Label').t`6-digit code`}</Label>
                    <Field className="mr1">
                        <Input
                            id="code"
                            value={code}
                            onChange={handleChangeCode}
                            placeholder={c('Placeholder').t`123456`}
                        />
                    </Field>
                </Row>
                <PrimaryButton disabled={!code} type="submit" loading={loading}>{c('Action').t`Verify`}</PrimaryButton>
            </form>
        </div>
    );
};

VerificationCodeForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onResend: PropTypes.func.isRequired
};

export default VerificationCodeForm;
