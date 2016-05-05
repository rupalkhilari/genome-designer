import React, { PropTypes } from 'react';

import '../../styles/BasePairCount.css';

function formatCount(count) {
  if (!count) {
    return '0 bp';
  }
  const thresh = 1000;

  if (count < thresh) {
    return `${count} bp`;
  }

  const sizes = ['bp', 'kb', 'Mb', 'Gb', 'Tb'];
  const ind = Math.floor(Math.log(count) / Math.log(thresh));
  return `${parseFloat((count / Math.pow(thresh, ind))).toFixed(1)} ${sizes[ind]}`;
}

export default function BasePairCount({ count, ...rest }) {
  const formatted = formatCount(count);
  return (<span className="BasePairCount" {...rest}>{formatted}</span>);
}

BasePairCount.propTypes = {
  count: PropTypes.number.isRequired,
};
