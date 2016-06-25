import React, { Component, PropTypes } from 'react';
import ModalWindow from './modal/modalwindow';

import '../styles/ok-cancel-form.css';

/**
 * Genbank import dialog.
 */
export default class OkCancel extends Component {

  static propTypes = {
    open: PropTypes.bool.isRequired,
    titleText: PropTypes.string.isRequired,
    messageHTML: PropTypes.string,
    okText: PropTypes.string,
    cancelText: PropTypes.string,
    ok: PropTypes.func.isRequired,
    cancel: PropTypes.func.isRequired,
  };

  render() {
    if (!this.props.open) {
      return null;
    }
    return (
      <div>
        <ModalWindow
          open
          title={this.props.titleText}
          payload={(
            <form
              className="gd-form ok-cancel-form"
              onSubmit={(evt) => {
                evt.preventDefault();
                this.props.ok();
              }}
            >
              <div className="title">{this.props.titleText}</div>
              {this.props.messageHTML}
              <button
                type="submit"
                onClick={(evt) => {
                  evt.preventDefault();
                  this.props.ok();
                }}
                >{this.props.okText || "Ok"}</button>
              <button
                type="button"
                onClick={this.props.cancel}
              >{this.props.cancelText || "Cancel"}
              </button>
            </form>

          )}
          closeOnClickOutside
          closeModal={buttonText => {

          }}
        />
      </div>
    );
  }
}
