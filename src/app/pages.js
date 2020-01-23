import { getDashboardPage } from './containers/DashboardContainer';
import { getAccountPage } from './containers/AccountContainer';
import { getDownloadsPage } from './containers/DownloadsContainer';
import { getPaymentsPage } from './containers/PaymentsContainer';
import { getSettingsPage } from './containers/SettingsContainer';

export const getPages = () => [
    getDashboardPage(),
    getAccountPage(),
    getDownloadsPage(),
    getPaymentsPage(),
    getSettingsPage()
];
