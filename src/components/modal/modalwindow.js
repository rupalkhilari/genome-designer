import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import ModalButtonBar from './modalbuttonbar';

import '../../../src/styles/Modal.css';

/**
 * modal window with user supplied payload and user defined ( optional )
 * buttons. The property this.props.closeModal is called when the modal is closed.
 * If the modal was closed via a button the button text is supplied.
 *
 */
export default class ModalWindow extends Component {

  static propTypes = {
    open: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired,
    closeOnClickOutside: PropTypes.bool,
    title: PropTypes.string.isRequired,
    payload: PropTypes.object.isRequired,
  };

  // mouse down on the blocker closes the modal, if props.closeOnClickOutside is true
  onMouseDown(evt) {
    const blockEl = ReactDOM.findDOMNode(this.refs.blocker);
    if (evt.target === blockEl && this.props.closeOnClickOutside) {
      this.props.closeModal();
    }
  }


  /*
   * render modal dialog with owner supplied payload and optional buttons.
   */
  render() {
    // only render contents if open
    const contents = this.props.open
    ? (<div className="modal-window">
        {this.props.payload}
      </div>)
    : null;
    return (
      <div
        onMouseDown={this.onMouseDown.bind(this)}
        className={this.props.open ? 'modal-blocker-visible' : 'modal-blocker-hidden'}
        ref="blocker">
        {contents}
      </div>
    );
  }
}
