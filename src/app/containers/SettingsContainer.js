import React from 'react';
import PropTypes from 'prop-types';
import { c } from 'ttag';
import { ThemesSection } from 'react-components';

import Page from '../components/page/Page';

export const getSettingsPage = () => {
    return {
        text: c('Title').t`Settings`,
        route: '/settings',
        icon: 'settings',
        permissions: [],
        sections: [
            {
                text: c('Title').t`Themes`,
                id: 'themes'
            }
        ]
    };
};

const SettingsContainer = ({ setActiveSection }) => {
    return (
        <Page config={getSettingsPage()} setActiveSection={setActiveSection}>
            <ThemesSection />
        </Page>
    );
};

SettingsContainer.propTypes = {
    setActiveSection: PropTypes.func
};

export default SettingsContainer;
