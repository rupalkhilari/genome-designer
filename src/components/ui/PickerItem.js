import React, { PropTypes } from 'react';
import RoleSvg from '../RoleSvg';

export default function PickerItem(props) {
  const { isCurrent, svg, name, styles, onClick, onMouseEnter } = props;

  return (<a className={'Picker-item' + (isCurrent ? ' active' : '')}
             alt={name}
             title={name}
             style={styles}
             onMouseEnter={(evt) => onMouseEnter && onMouseEnter(evt)}
             onClick={(evt) => onClick && onClick(evt)}>
    {svg && (<RoleSvg stroke={0.5}
                      width="100%"
                      height="100%"
                      color="white"
                      symbolName={svg}
                      key={svg}/>)}
    </a>
  );
}

PickerItem.propTypes = {
  isCurrent: PropTypes.bool.isRequired,
  styles: PropTypes.object,
  svg: PropTypes.string,
  name: PropTypes.string,
  onClick: PropTypes.func,
  onMouseEnter: PropTypes.func,
};
