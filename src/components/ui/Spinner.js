import React, { PropTypes } from 'react';

import '../../styles/Spinner.css';

export default function Spinner({ hidden, styles }) {
  if (hidden) {
    //todo - in React v15, can return null
    return <noscript />;
  }

  return (<div className="Spinner" style={styles}/>);
}

Spinner.propTypes = {
  hidden: PropTypes.bool,
  styles: PropTypes.object,
};

Spinner.defaultProps = {
  hidden: false,
  styles: {},
};
