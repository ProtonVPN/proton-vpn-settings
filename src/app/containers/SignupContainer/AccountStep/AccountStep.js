import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
    Title,
    SubTitle,
    Input,
    PasswordInput,
    PrimaryButton,
    Field,
    Alert,
    Block,
    LinkButton,
    useApi
} from 'react-components';
import { c } from 'ttag';
import { queryCheckUsernameAvailability } from 'proton-shared/lib/api/user';

// TODO: disabled form, password validations
const AccountStep = ({ onSubmit }) => {
    const api = useApi();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [usernameError, setUsernameError] = useState();

    const handleChangeUsername = ({ target }) => {
        if (usernameError) {
            setUsernameError(null);
        }
        setUsername(target.value);
    };
    const handleChangePassword = ({ target }) => setPassword(target.value);
    const handleSuggestionClick = (username) => () => setUsername(username);
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api(queryCheckUsernameAvailability(username));
            onSubmit(username, password);
        } catch (e) {
            const { Error: message, Details: { Suggestions: suggestions = [] } = {} } = e.data;
            setUsernameError({
                message,
                suggestions
            });
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Title>{c('Title').t`Complete account set-up`}</Title>
            <Block>
                <SubTitle>{c('Title').t`1. Choose your username`}</SubTitle>
                <Alert>{c('Info').t`Your username can be used for ProtonMail account`}</Alert>
                <Field>
                    <Input
                        error={usernameError && usernameError.message}
                        value={username}
                        onChange={handleChangeUsername}
                        name="username"
                    />
                    {usernameError && usernameError.suggestions.length > 0 && (
                        <>
                            <div>{c('Info').t`Available usernames:`}</div>
                            {usernameError.suggestions.map((suggestion) => (
                                <LinkButton
                                    className="mr0-5"
                                    onClick={handleSuggestionClick(suggestion)}
                                    key={suggestion}
                                >
                                    {suggestion}
                                </LinkButton>
                            ))}
                        </>
                    )}
                </Field>
            </Block>

            <Block>
                <SubTitle>{c('Title').t`2. Create your password`}</SubTitle>
                <Alert>{c('Info').t`Use 8 or more characters with a mix of letters, numbers & symbols`}</Alert>
                <Field>
                    <PasswordInput value={password} onChange={handleChangePassword} name="password" />
                </Field>
            </Block>

            <Field>
                <PrimaryButton disabled={usernameError || !username || !password} type="submit">{c('Action')
                    .t`Complete`}</PrimaryButton>
            </Field>
        </form>
    );
};

AccountStep.propTypes = {
    onSubmit: PropTypes.func.isRequired
};

export default AccountStep;
