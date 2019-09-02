import { useConfig, useApiResult } from 'react-components';
import { queryCheckVerificationCode, queryVerificationCode } from 'proton-shared/lib/api/user';

const useVerification = () => {
    const { CLIENT_TYPE } = useConfig();
    const { request: requestCode } = useApiResult(({ Type, Destination }) => queryVerificationCode(Type, Destination));
    const { request: requestVerification } = useApiResult(({ Token, TokenType }) =>
        queryCheckVerificationCode(Token, TokenType, CLIENT_TYPE)
    );

    const verify = async (code, { Type, Destination }) => {
        const verificationToken = { Token: `${Destination.Phone || Destination.Address}:${code}`, TokenType: Type };
        await requestVerification(verificationToken);
        return verificationToken;
    };

    return { verify, requestCode };
};

export default useVerification;
