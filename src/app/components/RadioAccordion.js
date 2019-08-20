import React, { Children } from 'react';
import PropTypes from 'prop-types';
import { Radio } from 'react-components';

const RadioAccordion = ({ name, children, onSelect, active }) => {
    const handleSelect = (id) => () => onSelect(id);

    return (
        <>
            {Children.map(children, (child) =>
                React.cloneElement(child, {
                    ...child.props,
                    name,
                    isActive: active === child.props.id,
                    onSelect: handleSelect(child.props.id)
                })
            )}
        </>
    );
};

RadioAccordion.propTypes = {
    name: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    onSelect: PropTypes.func.isRequired,
    active: PropTypes.string.isRequired
};

export const Option = ({ id, isActive = false, name, title, children, onSelect }) => {
    return (
        <div className="mb1 bordered-container">
            <Radio className="flex-items-center p1 w100" checked={isActive} onChange={onSelect} name={name} id={id}>
                {title}
            </Radio>
            {isActive && <div className="p1 ml0-5 mr0-5 mb0-5">{isActive && children}</div>}
        </div>
    );
};

Option.propTypes = {
    id: PropTypes.string.isRequired,
    title: PropTypes.node.isRequired,
    children: PropTypes.node.isRequired,
    // Below are injected
    isActive: PropTypes.bool,
    onSelect: PropTypes.func,
    name: PropTypes.string
};

export default RadioAccordion;
