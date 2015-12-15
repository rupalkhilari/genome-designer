import React, { PropTypes } from 'react';
import { colors } from '../../utils/generators/color';

import '../../styles/ColorPicker.css';

export const ColorPicker = ({current, onSelect}) => {
  return (
    <div className="ColorPicker">
      <div className="ColorPicker-colors">
        {colors.map(color => {
          return (<a className={'ColorPicker-color' + (current === color ? ' active' : '')}
                     key={color}
                     onClick={onSelect.bind(this, color)}
                     style={{backgroundColor: color}}/>);
        })}
    </div>
  </div>
  );
};

ColorPicker.propTypes = {
  current: PropTypes.string.isRequired,
  onSelect: PropTypes.func,
};

export default ColorPicker;
