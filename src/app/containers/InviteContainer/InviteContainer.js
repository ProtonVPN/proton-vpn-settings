import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
    Bordered,
    EmailInput,
    Alert,
    TextArea,
    PrimaryButton,
    Block,
    useConfig,
    useNotifications,
    useApiWithoutResult
} from 'react-components';
import { c } from 'ttag';
import { getClient, collectInfo } from 'react-components/helpers/report';
import { reportBug } from 'proton-shared/lib/api/reports';

const InviteContainer = ({ history }) => {
    const { createNotification } = useNotifications();
    const [description, setDescription] = useState('');
    const [email, setEmail] = useState('');
    const { CLIENT_ID, APP_VERSION, CLIENT_TYPE } = useConfig();
    const Client = getClient(CLIENT_ID);
    const { request, loading } = useApiWithoutResult(() =>
        reportBug({
            ...collectInfo(),
            Client,
            ClientVersion: APP_VERSION,
            ClientType: CLIENT_TYPE,
            Title: '[PROTONVPN - Invitation request]',
            Username: 'Manual invitation requested',
            Description: description,
            Email: email
        })
    );

    const handleSubmit = async (e) => {
        e.preventDefault();
        await request();
        createNotification({
            text: c('Notification')
                .t`Thank you for registering for a ProtonVPN account! We'll send you a notification email once your account is ready.`
        });
        history.push('/');
    };

    const handleChangeDescription = ({ target }) => setDescription(target.value);
    const handleChangeEmail = ({ target }) => setEmail(target.value);

    // TODO: text area validation
    return (
        <main className="main-full flex flex-column">
            <Bordered className="mauto w400e flex-aligncenter">
                <h3>{c('Title').t`Get an invitation`}</h3>
                <Alert>{c('Info').t`This email will be used for account creation`}</Alert>
                <form onSubmit={handleSubmit}>
                    <Block>
                        <EmailInput
                            value={email}
                            onChange={handleChangeEmail}
                            required
                            placeholder={c('Placeholder').t`Email`}
                        />
                    </Block>

                    <Block>
                        <TextArea
                            required
                            value={description}
                            onChange={handleChangeDescription}
                            placeholder={c('Placeholder').t`Please describe the problem or your request`}
                        />
                    </Block>

                    <PrimaryButton loading={loading} type="submit">{c('Action').t`Submit`}</PrimaryButton>
                </form>
            </Bordered>
        </main>
    );
};

InviteContainer.propTypes = {
    history: PropTypes.object.isRequired
};

export default InviteContainer;
