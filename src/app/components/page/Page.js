import React, { Children, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Alert, ObserverSections, SettingsTitle, usePermissions } from 'react-components';
import { hasPermission } from 'proton-shared/lib/helpers/permissions';
import { c } from 'ttag';
import { Link } from 'react-router-dom';

import Main from './Main';

const Page = ({ config, children, setActiveSection }) => {
    const userPermissions = usePermissions();
    const { sections = [], permissions: pagePermissions, text } = config;

    useEffect(() => {
        document.title = `${text} - ProtonVPN`;
    }, [text]);

    if (!hasPermission(userPermissions, pagePermissions)) {
        return (
            <Main>
                <SettingsTitle>{text}</SettingsTitle>
                <div className="container-section-sticky">
                    <Alert>
                        <Link to="/settings/subscription">{c('Link').t`Upgrade now`}</Link>
                    </Alert>
                </div>
            </Main>
        );
    }

    return (
        <Main>
            <SettingsTitle>{text}</SettingsTitle>
            <div className="container-section-sticky">
                <ObserverSections setActiveSection={setActiveSection}>
                    {Children.map(children, (child, index) => {
                        const { id, permissions: sectionPermissions = [] } = sections[index] || {};
                        return React.cloneElement(child, {
                            id,
                            permission: hasPermission(userPermissions, sectionPermissions)
                        });
                    })}
                </ObserverSections>
            </div>
        </Main>
    );
};

Page.propTypes = {
    setActiveSection: PropTypes.func,
    config: PropTypes.object,
    children: PropTypes.node
};

export default Page;
