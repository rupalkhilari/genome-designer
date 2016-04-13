import React, { PropTypes } from 'react';
import symbols from '../../inventory/sbol';
import SvgSbol from '../svgsbol';

import '../../styles/Picker.css';
import '../../styles/SymbolPicker.css';

export const SymbolPicker = ({current, readOnly, onSelect}) => {
  return (
    <div className={'Picker SymbolPicker' + (!!readOnly ? ' readOnly' : '')}>
      <div className="Picker-content">
        {symbols.map(symbolObj => {
          const symbol = symbolObj.id;
          return (<a className={'Picker-item' + (current === symbol ? ' active' : '')}
                     alt={symbolObj.name}
                     title={symbolObj.name}
                     key={symbol}
                     onClick={() => !readOnly && onSelect(symbol)}>
                     <SvgSbol stroke={0.5} width="100%" height="100%" color="white" symbolName={symbol} key={symbol}/>
                   </a>
                 );
        })}
        <a className={'Picker-item' + (!current ? ' active' : '')}
           style={{backgroundImage: `url(/images/sbolSymbols/thin/no_symbol.svg)`}}
           onClick={() => !readOnly && onSelect(null)}/>
      </div>
    </div>
  );
};

SymbolPicker.propTypes = {
  readOnly: PropTypes.bool,
  current: PropTypes.string,
  onSelect: PropTypes.func,
};

export default SymbolPicker;
