import React, { useState, useEffect } from 'react';
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
    useApiResult,
    useDebounceInput,
    LinkButton
} from 'react-components';
import { c } from 'ttag';
import { queryCheckUsernameAvailability } from 'proton-shared/lib/api/user';

// TODO: disabled form, validations
const AccountStep = ({ onSubmit }) => {
    const [rawUsername, setRawUsername] = useState('');
    const [password, setPassword] = useState('');
    const username = useDebounceInput(rawUsername, 500);
    const { request, error } = useApiResult(queryCheckUsernameAvailability);

    useEffect(() => {
        if (username) {
            request(username);
        }
    }, [username]);

    const handleChangeUsername = ({ target }) => setRawUsername(target.value);
    const handleChangePassword = ({ target }) => setPassword(target.value);
    const handleSuggestionClick = (username) => () => setRawUsername(username);
    const handlSubmit = (e) => {
        e.preventDefault();
        onSubmit(username, password);
    };

    const { Error: errorMessage, Details: { Suggestions = [] } = {} } = error ? error.data : {};

    return (
        <form onSubmit={handlSubmit}>
            <Title>{c('Title').t`Complete account set-up`}</Title>
            <Block>
                <SubTitle>{c('Title').t`1. Choose your username`}</SubTitle>
                <Alert>{c('Info').t`Your username can be used for ProtonMail account`}</Alert>
                <Field>
                    <Input error={errorMessage} value={rawUsername} onChange={handleChangeUsername} name="username" />
                    {Suggestions.length > 0 && <div>{c('Info').t`Available usernames:`}</div>}
                    {Suggestions.map((suggestion) => (
                        <LinkButton className="mr0-5" onClick={handleSuggestionClick(suggestion)} key={suggestion}>
                            {suggestion}
                        </LinkButton>
                    ))}
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
                <PrimaryButton type="submit">{c('Action').t`Complete`}</PrimaryButton>
            </Field>
        </form>
    );
};

AccountStep.propTypes = {
    onSubmit: PropTypes.func.isRequired
};

export default AccountStep;
