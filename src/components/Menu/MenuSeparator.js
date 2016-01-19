import React, { Component } from 'react';
/**
 * Popup window class. Accepts any component as it client.
 * Required properties:
 *
 * {String} title - title bar text for window
 * {Function} onClose - function to call when the window is closed
 * {ReactElement} client - element to place in the client area
 */
export default class MenuSeparator extends Component {
  render() {
    return (
      <hr></hr>
    );
  }
}
