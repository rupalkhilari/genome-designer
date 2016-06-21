import React, { Component, PropTypes } from 'react';
import symbols, { symbolMap } from '../../inventory/roles';
import PickerItem from './PickerItem';

import '../../styles/Picker.css';
import '../../styles/SymbolPicker.css';

export default class SymbolPicker extends Component {
  static propTypes = {
    readOnly: PropTypes.bool,
    current: PropTypes.any,
    onSelect: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      showContent: false,
      hoverText: this.makeHoverText(props.current),
    };
  }

  makeHoverText(symbolId) {
    return symbolMap[symbolId] || symbolId || 'No Symbol';
  }

  onClickCurrent = () => {
    const handleDocumentClick = (evt) => {
      this.setState({ showContent: false });
      document.removeEventListener('click', handleDocumentClick);
    };
    if (this.state.showContent || this.props.readOnly) return; //dont register more than once

    document.addEventListener('click', handleDocumentClick);
    this.setState({ showContent: true });
  };

  onMouseEnter = (hoverText) => {
    this.setState({ hoverText });
  };

  onMouseOut = () => {
    this.setState({ hoverText: this.makeHoverText(this.props.current) });
  };

  render() {
    const { current, readOnly, onSelect } = this.props;
    const noSymbol = 'noSymbol';
    const noSymbolText = 'No Symbol';
    const currentSymbol = current || ((current === false) ? null : noSymbol);

    return (
      <div className={'Picker SymbolPicker' + (!!readOnly ? ' readOnly' : '')}>
        <div className="Picker-current"
             onClick={this.onClickCurrent}>
          <PickerItem isCurrent={false}
                      svg={currentSymbol}/>
        </div>
        {this.state.showContent && (
          <div className="Picker-content"
               onMouseOut={this.onMouseOut}>
            <div className="Picker-currentHovered">{this.state.hoverText}</div>
            <div className="Picker-options">
              {symbols.map(symbolObj => {
                const { id, name } = symbolObj;

                return (<PickerItem key={id}
                                    isCurrent={current === id}
                                    name={name}
                                    svg={id}
                                    onMouseEnter={() => this.onMouseEnter(name)}
                                    onMouseOut={(evt) => evt.stopPropagation()}
                                    onClick={() => !readOnly && onSelect(id)}
                />);
              })}
              <PickerItem isCurrent={!current}
                          name={noSymbolText}
                          svg={noSymbol}
                          onMouseEnter={() => this.onMouseEnter(noSymbolText)}
                          onMouseOut={(evt) => evt.stopPropagation()}
                          onClick={() => !readOnly && onSelect(null)}
              />
            </div>
          </div>
        )}
      </div>
    );
  }
}
