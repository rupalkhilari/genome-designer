import React, { Component, PropTypes } from 'react';
import symbols from '../../inventory/sbol';
import PickerItem from './PickerItem';

import '../../styles/Picker.css';
import '../../styles/SymbolPicker.css';

export default class SymbolPicker extends Component {
  static propTypes = {
    readOnly: PropTypes.bool,
    current: PropTypes.string,
    onSelect: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      showContent: false,
      hoverText: props.current || '',
    };
  }

  onClickCurrent = () => {
    const handleDocumentClick = (evt) => {
      if (this.pickerToggler.contains(evt.target)) return;

      this.setState({showContent: false});
      document.removeEventListener('click', handleDocumentClick);
    };
    if (this.state.showContent || this.props.readOnly) return; //dont register more than once

    document.addEventListener('click', handleDocumentClick);
    this.setState({showContent: true});
  };

  onMouseEnter = (hoverText) => {
    this.setState({ hoverText });
  };

  onMouseOut = () => {
    const def = 'No Symbol';
    this.setState({ hoverText: this.props.current || def });
  };

  render() {
    const { current, readOnly, onSelect } = this.props;
    const noSymbol = 'noSymbol';
    const hoverTextDefault = 'No Symbol';

    //hack hack hack - just positioning picker using pixels, not very smart about figuring out where it is, assuming this is always a second picker

    return (
      <div className={'Picker SymbolPicker' + (!!readOnly ? ' readOnly' : '')}>
        <div className="Picker-current"
             ref={ref => this.pickerToggler = ref}
             onClick={this.onClickCurrent}>
          <PickerItem isCurrent={false}
                      svg={current || noSymbol}/>
        </div>
        {this.state.showContent && (
          <div className="Picker-content"
               onMouseOut={this.onMouseOut}>
            <div className="Picker-currentHovered">{this.state.hoverText || hoverTextDefault}</div>
            <div className="Picker-options">
              {symbols.map(symbolObj => {
                const { id, name } = symbolObj;

                return (<PickerItem key={id}
                                    isCurrent={current === id}
                                    name={name}
                                    svg={id}
                                    onMouseEnter={() => this.onMouseEnter(id)}
                                    onClick={() => !readOnly && onSelect(id)}
                />);
              })}
              <PickerItem isCurrent={!current}
                          name={'No Symbol'}
                          svg={noSymbol}
                          onClick={() => !readOnly && onSelect(null)}
              />
            </div>
          </div>
        )}
      </div>
    );
  }
}
