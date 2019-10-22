import { useEffect, ReactChildren } from 'react';

type Props = {
    children: ReactChildren;
    title: string;
};

const PublicPage = ({ children, title }: Props) => {
    useEffect(() => {
        document.title = `${title} - ProtonVPN`;
    }, [title]);

    return children;
};

export default PublicPage;
