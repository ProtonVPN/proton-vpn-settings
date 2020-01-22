import React from 'react';
import { PlansSection, SubscriptionSection, BillingSection, useUser } from 'react-components';
import { PERMISSIONS } from 'proton-shared/lib/constants';
import { c } from 'ttag';

import Page from '../components/page/Page';

const { UPGRADER, PAID } = PERMISSIONS;

export const getDashboardPage = (user = {}) => {
    return {
        text: c('Title').t`Dashboard`,
        route: '/dashboard',
        icon: 'dashboard',
        permissions: [UPGRADER],
        sections: [
            !user.isPaid && {
                text: c('Title').t`Plans`,
                id: 'plans'
            },
            {
                text: c('Title').t`Subscription`,
                id: 'subscription',
                permissions: [PAID]
            },
            {
                text: c('Title').t`Billing`,
                id: 'billing',
                permissions: [PAID]
            }
        ].filter(Boolean)
    };
};

const DashboardContainer = () => {
    const [user, loadingUser] = useUser();

    if (loadingUser) {
        return null;
    }

    if (user.isPaid) {
        return (
            <Page config={getDashboardPage(user)}>
                <SubscriptionSection />
                <BillingSection />
            </Page>
        );
    }

    return (
        <Page config={getDashboardPage()}>
            <PlansSection />
            <SubscriptionSection />
            <BillingSection />
        </Page>
    );
};

export default DashboardContainer;
