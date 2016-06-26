import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import '../../../src/styles/Modal.css';
import '../../../src/styles/modalspinner.css';

/**
 * modal window with user supplied payload and user defined ( optional )
 * buttons. The property this.props.closeModal is called when the modal is closed.
 * If the modal was closed via a button the button text is supplied.
 *
 */
export default class ModalSpinner extends Component {

  static propTypes = {
    open: PropTypes.number,
  };

  /*
   * render modal dialog with owner supplied payload and optional buttons.
   */
  render() {
    if (!this.props.spinMessage) {
      return null;
    }
    return (
      <div className="modal-blocker-visible">
        <div className="ModalSpinner">{this.props.spinMessage}
        </div>
      </div>
    );
  }
}
