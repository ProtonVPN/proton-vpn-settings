import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
    Input,
    PasswordInput,
    PrimaryButton,
    Field,
    useApi,
    Row,
    Label,
    EmailInput,
    Block,
    useLoading
} from 'react-components';
import { c } from 'ttag';
import { queryCheckUsernameAvailability } from 'proton-shared/lib/api/user';

const AccountForm = ({ onSubmit }) => {
    const api = useApi();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [usernameError, setUsernameError] = useState();
    const [loading, withLoading] = useLoading();

    const handleChangeUsername = ({ target }) => {
        if (usernameError) {
            setUsernameError(null);
        }
        setUsername(target.value);
    };

    const handleChangePassword = ({ target }) => setPassword(target.value);
    const handleChangeEmail = ({ target }) => setEmail(target.value);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api(queryCheckUsernameAvailability(username));
            onSubmit({
                username,
                password,
                email
            });
        } catch (e) {
            setUsernameError(e.data ? e.data.Error : c('Error').t`Can't check username, try again later`);
        }
    };

    return (
        <form onSubmit={(e) => withLoading(handleSubmit(e))}>
            <Row>
                <Label htmlFor="username">{c('Label').t`Username`}</Label>
                <Field>
                    <Input
                        required
                        error={usernameError}
                        value={username}
                        onChange={handleChangeUsername}
                        name="username"
                        id="username"
                    />
                </Field>
            </Row>

            <Row>
                <Label htmlFor="password">{c('Label').t`Password`}</Label>
                <Field>
                    <div className="mb1">
                        <PasswordInput
                            id="password"
                            required
                            value={password}
                            onChange={handleChangePassword}
                            name="password"
                        />
                    </div>
                    <PasswordInput id="passwordConfirmation" name="passwordConfirmation" pattern={password} />
                </Field>
            </Row>

            <Row>
                <Label htmlFor="email">{c('Label').t`Email`}</Label>
                <Field>
                    <EmailInput
                        id="email"
                        required
                        value={email}
                        onChange={handleChangeEmail}
                        placeholder={c('Placeholder').t`user@domain.com`}
                    />
                </Field>
            </Row>

            <Block>
                {c('Info').t`By clicking Create Account you agree to abide by ProtonVPN's Terms and Conditions`}
            </Block>

            <PrimaryButton loading={loading} type="submit">{c('Action').t`Complete`}</PrimaryButton>
        </form>
    );
};

AccountForm.propTypes = {
    onSubmit: PropTypes.func.isRequired
};

export default AccountForm;
