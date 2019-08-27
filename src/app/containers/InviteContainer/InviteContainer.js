import React from 'react';
import { Bordered, EmailInput, Alert, TextArea, PrimaryButton, Block } from 'react-components';
import { c } from 'ttag';

const InviteContainer = () => {
    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: send invite via bug report API
    };

    return (
        <main className="main-full flex flex-column">
            <Bordered className="mauto w400e flex-aligncenter">
                <h3>{c('Title').t`Get an invitation`}</h3>
                <Alert>{c('Info').t`This email will be used for account creation`}</Alert>
                <form onSubmit={handleSubmit}>
                    <Block>
                        <EmailInput required placeholder={c('Placeholder').t`Email`} />
                    </Block>

                    <Block>
                        <TextArea
                            required
                            placeholder={c('Placeholder').t`Please describe the problem or your request`}
                        />
                    </Block>

                    <PrimaryButton type="submit">{c('Action').t`Submit`}</PrimaryButton>
                </form>
            </Bordered>
        </main>
    );
};

export default InviteContainer;
