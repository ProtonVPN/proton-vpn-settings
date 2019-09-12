import React from 'react';
import PropTypes from 'prop-types';
import { c } from 'ttag';
import { SubTitle, Row, Alert, Href, Icon } from 'react-components';

const MobileRedirectionStep = ({ model }) => {
    return (
        <div className="pt2 mb2">
            <SubTitle>{c('Title').t`Account created`}</SubTitle>
            <Row>
                <Icon name="on" />
                <Alert>{c('Info')
                    .t`Your account has been successfully created. You will be redirected to the ProtonVPN app.`}</Alert>
                <Href className="pm-button" url={`protonvpn://registered?username=${model.username}`} target="_top">{c(
                    'Link'
                ).t`Close`}</Href>
            </Row>
        </div>
    );
};

MobileRedirectionStep.propTypes = {
    model: PropTypes.object.isRequired
};

export default MobileRedirectionStep;
