import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import ModalWindow from './modalwindow';

class SaveErrorModal extends Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
  };

  render() {
    // no render when not open
    if (!this.props.open) {
      return null;
    }

    return (
      <ModalWindow
        open={this.props.open}
        title="Unable to Save"
        closeModal={() => {}}
        payload={(
          <div style={{padding: '1rem 2em 3rem', width: '60rem'}}
               className="gd-form">
            <div className="title">Unable to Save</div>

            <p>Genetic Constructor automatically saves every edit you make, but the most recent edit could not be saved, and will be rolled back.</p>
            <p>Please reload the page to revert your project, and try the action again.</p>
            <p>If you repeatedly encounter this problem, please <a href="https://forum.bionano.autodesk.com/c/genetic-constructor/support" target="_blank">contact Support.</a></p>
            <br />
            <button
                type="submit"
                onClick={() => {document.location.reload();}}>
                Reload
            </button>
          </div>
        )}/>
    );
  }
}

function mapStateToProps(state) {
  return {
    open: state.ui.modals.showSaveError,
  };
}

export default connect(mapStateToProps)(SaveErrorModal);
