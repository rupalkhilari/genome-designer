import React, { PropTypes } from 'react';

export default function ListOption({ selected, onClick }) {
  //todo

  return (
    <div className={'ListOption' +
                    (selected ? ' selected' : '')}
         onClick={onClick}>

    </div>
  );
}

ListOption.propTypes = {
  block: PropTypes.shape({
    source: PropTypes.object.isRequired,
  }).isRequired,
};
