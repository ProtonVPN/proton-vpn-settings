import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { c } from 'ttag';
import { withRouter } from 'react-router-dom';
import { useApi, useConfig, PrimaryButton, Input } from 'react-components';
import { queryCheckVerificationCode } from 'proton-shared/lib/api/user';
import { checkSubscription } from 'proton-shared/lib/api/payments';
import { TOKEN_TYPES } from 'proton-shared/lib/constants';
import { API_CUSTOM_ERROR_CODES } from 'proton-shared/lib/errors';

const RedeemCouponForm = () => {
    const api = useApi();
    const { CLIENT_TYPE } = useConfig();
    const [couponCode, setCouponCode] = useState();
    const [validationError, setValidationError] = useState();

    const handleCouponCodeChange = useCallback(({ target: { value } }) => {
        setCouponCode(value);
    }, []);

    const handleSubmit = useCallback(
        async (e) => {
            e.preventDefault();

            try {
                const {
                    Plans: [{ ID, Currency, Cycle, Quantity }]
                } = await api(queryCheckVerificationCode(couponCode, TOKEN_TYPES.COUPON, CLIENT_TYPE));

                const response = await api(
                    checkSubscription({
                        CouponCode: couponCode,
                        Currency,
                        Cycle,
                        PlanIDs: {
                            [ID]: Quantity
                        }
                    })
                );

                history.push('/signup', response);
            } catch (e) {
                if (!e.data) {
                    throw e;
                } else if (e.data.Code === API_CUSTOM_ERROR_CODES.TOKEN_INVALID) {
                    setValidationError('Invalid coupon. Please try again.');
                } else {
                    setValidationError(e.data.Error);
                }
            }
        },
        [couponCode]
    );

    return (
        <form className="redeem-form w100 col flex flex-column pb2" onSubmit={handleSubmit}>
            <Input
                className="redeem-coupon-code-input"
                placeholder={c('Placeholder').t`Enter coupon code`}
                onChange={handleCouponCodeChange}
                error={validationError}
                errorZoneClassName="bg-global-warning color-white aligncenter p0-5"
            />
            <PrimaryButton
                type="submit"
                className="redeem-submit-button pm-button--noborder uppercase bold mt2 pt1 pb1"
            >
                {c('Action').t`Activate my coupon`}
            </PrimaryButton>
        </form>
    );
};

RedeemCouponForm.propTypes = {
    history: PropTypes.object
};

export default withRouter(RedeemCouponForm);
