import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import '../../../src/styles/ordermodal.css';

export default class Selector extends Component {
  static propTypes = {
    options: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.any,
    disabled: PropTypes.bool.isRequired,
  };

  state = {
    menuOpen: false,
  }

  onClick = () => {

  }

  onShowMenu = () => {
    this.setState({
      menuOpen: true,
    });
  }

  closeMenu = () => {
    this.setState({
      menuOpen: false,
    });
  }

  onMouseLeave = () => {
    if (this.state.menuOpen) {
      this.setState({menuOpen: false});
    }
  }

  render() {
    let menu = null;
    if (this.state.menuOpen) {
      const items = this.props.options.map(item => {
        return (
          <div
            className="menu-item"
            onClick={(evt) => {
              evt.preventDefault();
              evt.stopPropagation();
              this.setState({menuOpen: false});
              this.props.onChange(item);
            }}
          >{item}</div>
        )
      });
      menu = (
        <div className="selector-menu" children={items}/>
      )
    }

    return (
      <div>
        <div
            className="dropdown"
            onClick={this.onShowMenu}
            onMouseLeave={this.onMouseLeave}
          >{this.props.value}
          {menu}
        </div>
        <div className="selector-arrow"/>
      </div>
    );
  }
}
