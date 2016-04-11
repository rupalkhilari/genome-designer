import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import ReactTransitionGroup from 'react-addons-css-transition-group';

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
    title: PropTypes.string,
    payload: PropTypes.object.isRequired,
  };

  constructor() {
    super();
    setTimeout(() => {
      const dom = React.findDOMNode(this.refs.window);
      if (dom) {
        dom.style.transform = `translate(-50%, 0px)`;
      }
    }, 10);
  }

  // mouse down on the blocker closes the modal, if props.closeOnClickOutside is true
  onMouseDown(evt) {
    const blockEl = ReactDOM.findDOMNode(this.refs.blocker);
    if (evt.target === blockEl && this.props.closeOnClickOutside) {
      this.props.closeModal();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.open && !nextProps.open) {
      debugger;
      // transitioning to open
      setTimeout(() => {
        debugger;
        const dom = react.findDOMNode(this.refs.window);
        dom.style.transform = `translate(-50%, 0px)`;
      }, 10);
    }
  }


  /*
   * render modal dialog with owner supplied payload and optional buttons.
   */
  render() {
    // only render contents if open
    const contents = this.props.open
    ? (<div ref="window" className="modal-window">
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
