import React, { Component, PropTypes } from 'react';

import '../../styles/Toggler.css';

export default function Toggler({ onClick, hidden, open, disabled }) {
  if (hidden) {
    //todo - in React v15, can return null
    return <noscript />;
  }

  const handleClick = (evt) => {
    if (!this.props.disabled) {
      this.props.onClick(evt);
    }
  };

  return (<span className={'Toggler' +
                           (disabled ? ' disabled' : '') +
                           (open ? ' open' : '')}
                onClick={handleClick}/>);
}

Toggler.propTypes = {
  onClick: PropTypes.func,
  open: PropTypes.bool,
  disabled: PropTypes.bool,
  hidden: PropTypes.bool,
};

Toggler.defaultProps = {
  onClick: () => {},
  hidden: false,
  open: false,
  disabled: false,
};
