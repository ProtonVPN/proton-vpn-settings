import { c } from 'ttag';
import { PLANS, PLAN_NAMES } from 'proton-shared/lib/constants';

export const getPlans = () => ({
    [PLANS.FREE]: {
        title: PLAN_NAMES[PLANS.FREE],
        monthlyPrice: 0,
        description: c('Plan Description').t`Free limited version`,
        highlights: [c('Plan Feature').t`Access to 3 countries`, c('Plan Feature').t`1 device`],
        features: [
            c('Plan Feature').t`Access to 3 countries`,
            c('Plan Feature').t`1 device`,
            c('Plan Feature').t`Free trial of Plus account for 7 days`,
            c('Plan Feature').t`Multi-platform support`
        ]
    },
    [PLANS.VPNBASIC]: {
        title: PLAN_NAMES[PLANS.VPNBASIC],
        monthlyPrice: 500,
        description: c('Plan Description').t`Basic privacy features`,
        highlights: [
            c('Plan Feature').t`Access to all countries`,
            c('Plan Feature').t`2 devices`,
            c('Plan Feature').t`30-day money-back guarantee`
        ],
        features: [
            c('Plan Feature').t`Access to all countries`,
            c('Plan Feature').t`2 devices`,
            c('Plan Feature').t`High speeds`,
            c('Plan Feature').t`Safe file sharing`,
            c('Plan Feature').t`Multi-platform support`,
            c('Plan Feature').t`30-day money-back guarantee`
        ]
    },
    [PLANS.VPNPLUS]: {
        title: PLAN_NAMES[PLANS.VPNPLUS],
        isBest: true,
        monthlyPrice: 1000,
        description: c('Plan Description').t`The complete privacy suite`,
        highlights: [
            c('Plan Feature').t`Access to all countries`,
            c('Plan Feature').t`5 devices`,
            c('Plan Feature').t`All advanced security features included`,
            c('Plan Feature').t`30-day money-back guarantee`
        ],
        features: [
            c('Plan Feature').t`Access to all countries`,
            c('Plan Feature').t`5 devices`,
            c('Plan Feature').t`Highest speeds`,
            c('Plan Feature').t`Secure Core servers`,
            c('Plan Feature').t`Safe file sharing`,
            c('Plan Feature').t`Secure streaming`,
            c('Plan Feature').t`Tor servers`,
            c('Plan Feature').t`Multi-platform support`,
            c('Plan Feature').t`30-day money-back guarantee`
        ]
    },
    [PLANS.VISIONARY]: {
        title: PLAN_NAMES[PLANS.VISIONARY],
        monthlyPrice: 3000,
        description: c('Plan Description').t`Plus 5 devices + ProtonMail Visionary plan`,
        features: [
            c('Plan Feature').t`Access to all countries`,
            c('Plan Feature').t`10 devices`,
            c('Plan Feature').t`Highest speeds`,
            c('Plan Feature').t`Secure Core servers`,
            c('Plan Feature').t`Safe file sharing`,
            c('Plan Feature').t`Secure streaming`,
            c('Plan Feature').t`Tor servers`,
            c('Plan Feature').t`ProtonMail Visionary included`,
            c('Plan Feature').t`Multi-platform support`,
            c('Plan Feature').t`30-day money-back guarantee`
        ]
    }
});

export const getPlan = (planName) => getPlans()[planName];

export const getPlanPrice = (plan, isAnnual) => {
    const discount = isAnnual ? 0.2 : 0;
    const monthlyPrice = plan.monthlyPrice - plan.monthlyPrice * discount;
    const totalPrice = isAnnual ? monthlyPrice * 12 : monthlyPrice;
    const totalSaved = plan.monthlyPrice * 12 * discount;
    return { monthlyPrice, totalPrice, totalSaved };
};
