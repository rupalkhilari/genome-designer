import React, { Component, PropTypes } from 'react';

/**
 * Popup window class. Accepts any component as it client.
 * Required properties:
 *
 * {String} title - title bar text for window
 * {Function} onClose - function to call when the window is closed
 * {ReactElement} client - element to place in the client area
 */
export default class MenuItem extends Component {
  static propTypes = {
    text: PropTypes.string.isRequired,
    action: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
  };

  render() {

    // indent if checkable regardless of checked state
    const indent = this.props.checked === true || this.props.checked === false;
    let check = null;
    if (indent) {
      check = <div className={this.props.checked ? 'menu-item-checked' : 'menu-item-unchecked'}></div>;
    }

    return (
      <div className={'menu-item' + (this.props.disabled ? ' disabled' : '')}
           onClick={() => !this.props.disabled && this.props.action()}>
        {check}
        {this.props.text}
        <div className="menu-item-shortcut" disabled="this.props.disabled">{this.props.shortcut}</div>
      </div>
    );
  }
}
