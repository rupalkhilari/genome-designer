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

  render() {

    return (
      <div>
        <div
            className="dropdown"
            onClick={this.onShowMenu}
          >Selector&nbsp;&#x2193;
        </div>
      </div>
    );
  }
}
