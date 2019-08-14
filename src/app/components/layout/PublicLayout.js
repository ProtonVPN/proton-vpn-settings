import React from 'react';
import PropTypes from 'prop-types';
import { Icons } from 'react-components';

const PublicLayout = ({ children }) => {
    return (
        <>
            <div className="flex flex-nowrap">
                <main className="flex-item-fluid main-area main-full">{children}</main>
            </div>
            <Icons />
        </>
    );
};

PublicLayout.propTypes = {
    children: PropTypes.node.isRequired
};

export default PublicLayout;
