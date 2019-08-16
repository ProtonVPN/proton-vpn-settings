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
        <div>
            <Radio checked={isActive} onChange={onSelect} name={name} id={id}>
                {title}
            </Radio>
            <div>{isActive && children}</div>
        </div>
    );
};

Option.propTypes = {
    id: PropTypes.string.isRequired,
    title: PropTypes.node.isRequired,
    children: PropTypes.node.isRequired,
    // Below are injected
    isActive: PropTypes.bool.isRequired,
    onSelect: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired
};

export default RadioAccordion;
