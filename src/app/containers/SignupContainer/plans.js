import { c } from 'ttag';
import { PLANS, PLAN_NAMES, PLAN_TYPES, CYCLE } from 'proton-shared/lib/constants';

// TODO: devices based on dynamic plan
const getPlanFeatures = (planName) =>
    ({
        [PLANS.FREE]: {
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
            isBest: true,
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
    }[planName]);

// TODO: two-year deal
const getPlanPrice = (plan, cycle) => {
    const isMonthly = cycle === CYCLE.MONTHLY;
    const monthlyPrice = plan.Pricing[CYCLE.MONTHLY];
    const annualPrice = plan.Pricing[CYCLE.YEARLY];

    const monthly = isMonthly ? monthlyPrice : annualPrice / CYCLE.YEARLY;
    const total = isMonthly ? monthlyPrice : annualPrice;
    const saved = monthlyPrice * CYCLE.YEARLY - monthly * CYCLE.YEARLY;

    return { monthly, total, saved };
};

export const getPlan = (planName, cycle, appliedCoupon, plans = []) => {
    const plan = plans.find(({ Type, Name }) => Type === PLAN_TYPES.PLAN && Name === planName);
    const price = plan ? getPlanPrice(plan, cycle) : { monthly: 0, total: 0, saved: 0 };

    if (appliedCoupon) {
        price.total = appliedCoupon.AmountDue;
    }

    return {
        ...getPlanFeatures(planName),
        planName,
        title: PLAN_NAMES[planName],
        id: plan && plan.ID,
        price
    };
};
