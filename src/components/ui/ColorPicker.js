import React, { PropTypes } from 'react';
import { colors } from '../../utils/generators/color';

import '../../styles/Picker.css';
import '../../styles/ColorPicker.css';

export const ColorPicker = ({current, readOnly, onSelect}) => {
  return (
    <div className={'Picker ColorPicker' + (!!readOnly ? ' readOnly' : '')}>
      <div className="Picker-content">
        {colors.map(color => {
          return (<a className={'Picker-item' + (current === color ? ' active' : '')}
                     key={color}
                     onClick={() => !readOnly && onSelect(color)}
                     style={{backgroundColor: color}}/>);
        })}
    </div>
  </div>
  );
};

ColorPicker.propTypes = {
  readOnly: PropTypes.bool,
  current: PropTypes.string,
  onSelect: PropTypes.func,
};

export default ColorPicker;
