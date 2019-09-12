import React from 'react';
import PropTypes from 'prop-types';
import { c } from 'ttag';
import { SubTitle, Row, Href, Icon, Paragraph } from 'react-components';

const MobileRedirectionStep = ({ model }) => {
    return (
        <div className="pt2 mb2">
            <SubTitle>{c('Title').t`Account created`}</SubTitle>
            <Row className="aligncenter">
                <Icon name="on" className="mb2" fill="success" size={100} />
                <Paragraph className="mb2">{c('Info')
                    .t`Your account has been successfully created. Please press the "Close" button to be taken back to the app.`}</Paragraph>
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
