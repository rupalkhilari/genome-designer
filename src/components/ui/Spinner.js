import React, { PropTypes } from 'react';

import '../../styles/Spinner.css';

export default function LoadingSpinner({ hidden, styles }) {
  if (hidden) {
    //todo - in React v15, can return null
    return <noscript />;
  }

  return (<div className="loadingSpinner" styles={styles}/>);
}

LoadingSpinner.propTypes = {
  hidden: PropTypes.bool,
  styles: PropTypes.object,
};

LoadingSpinner.defaultProps = {
  hidden: false,
  styles: {}
};
