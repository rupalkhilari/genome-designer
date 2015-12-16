import React, { PropTypes } from 'react';
import { colors } from '../../utils/generators/color';

import '../../styles/Picker.css';
import '../../styles/ColorPicker.css';

export const ColorPicker = ({current, onSelect}) => {
  return (
    <div className="Picker ColorPicker">
      <div className="Picker-content">
        {colors.map(color => {
          return (<a className={'Picker-item' + (current === color ? ' active' : '')}
                     key={color}
                     onClick={onSelect.bind(this, color)}
                     style={{backgroundColor: color}}/>);
        })}
    </div>
  </div>
  );
};

ColorPicker.propTypes = {
  current: PropTypes.string,
  onSelect: PropTypes.func,
};

export default ColorPicker;
