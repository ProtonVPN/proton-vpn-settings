import React from 'react';
import PropTypes from 'prop-types';
import { c } from 'ttag';
import { Href, Button, PrimaryButton, Block } from 'react-components';

const FreeSignupSection = ({ isPlusActive, onContinue, onUpgrade }) => {
    const tosLink = <Href url="https://protonvpn.com/terms-and-conditions">{c('Link').t`Terms of Service`}</Href>;
    const policyLink = <Href url="https://protonvpn.com/privacy-policy">{c('Link').t`Privacy Policy`}</Href>;
    return (
        <div className="mb2">
            <Block className="mt2">{c('Info')
                .jt`By choosing ProtonVPN Free, you agree to abide by our ${tosLink} and ${policyLink}`}</Block>
            <div className="flex onmobile-flex-column">
                <div>
                    {isPlusActive ? (
                        <PrimaryButton onClick={onContinue}>{c('Action').t`Continue to payment`}</PrimaryButton>
                    ) : (
                        <Button onClick={onContinue}>{c('Action').t`Get ProtonVPN Free`}</Button>
                    )}
                </div>
                <div className="ml1 mr1 mt0-5">{c('Free plan info').t`or`}</div>
                <div className="flex flex-column">
                    <PrimaryButton onClick={onUpgrade}>{c('Action').t`Unlock full features with Plus`}</PrimaryButton>
                    <ul>
                        <li>{c('Plus features').t`5 devices`}</li>
                        <li>{c('Plus features').t`Secure Streaming`}</li>
                        <li>{c('Plus features').t`Safe File Sharing`}</li>
                        <li>{c('Plus features').t`Kill switch Security`}</li>
                        <li>{c('Plus features').t`Onion over VPN`}</li>
                        <li>{c('Plus features').t`30-day money-back guarantee`}</li>
                    </ul>
                    {isPlusActive && <div>{c('Info').t`Plus plan selected`}</div>}
                </div>
            </div>
        </div>
    );
};

FreeSignupSection.propTypes = {
    isPlusActive: PropTypes.bool,
    onContinue: PropTypes.func.isRequired,
    onUpgrade: PropTypes.func.isRequired
};

export default FreeSignupSection;
