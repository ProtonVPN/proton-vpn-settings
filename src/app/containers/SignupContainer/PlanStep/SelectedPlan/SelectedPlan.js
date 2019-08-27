import React from 'react';
import { c } from 'ttag';
import { Price } from 'react-components';
import useSignup from '../../useSignup';

const SelectedPlan = () => {
    const {
        selectedPlan,
        model: { isAnnual, currency }
    } = useSignup();
    const planTitle = c('VPN plan title').t`ProtonVPN ${selectedPlan.title}`;

    return (
        <div className="m1">
            <div className="flex flex-column bordered-container selected-plan">
                <h3 className="pt1 pb1 mb0 w100 aligncenter bg-pv-green-light color-white">{planTitle}</h3>
                {selectedPlan.isBest && (
                    <strong className="bg-plus aligncenter small p1 m0">{c('Info')
                        .t`Congrats! You chose our BEST OFFER!`}</strong>
                )}
                <ul className="ml1 mr1">
                    {selectedPlan.features.map((feature, i) => (
                        <li key={i}>{feature}</li>
                    ))}
                </ul>
                <hr />
                <div className="pb1 pl1 pr1">
                    {selectedPlan.price.monthly > 0 && (
                        <div className="flex flex-spacebetween">
                            <span className="mr0-25">{planTitle}:</span>
                            <strong>
                                <Price currency={currency}>{selectedPlan.price.monthly}</Price>
                            </strong>
                        </div>
                    )}
                    <div className="flex flex-spacebetween">
                        <strong className="mr0-25">
                            {isAnnual ? c('Plan price total').jt`Total (12 months):` : c('Plan price total').jt`Total:`}
                        </strong>
                        <Price currency={currency}>{selectedPlan.price.total}</Price>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SelectedPlan;
