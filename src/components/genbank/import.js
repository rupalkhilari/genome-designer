import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux';
import invariant from 'invariant';
import ModalWindow from '../modal/modalwindow';
import Dropzone from 'react-dropzone';

import '../../../src/styles/genbank.css';

class ImportGenBankModal extends Component {

  static propTypes = {

  };

  constructor() {
    super();
  }

  onDrop(files) {
    alert('Received files: ' + files.toString());
  }

  render() {
    return (
      <div>
        <ModalWindow
          open
          title="Import GenBank File"
          payload={(
            <form
              id="genbank-import-form"
              className="genbank-import-form">
              <div className="title">Import</div>
              <div className="radio">
                <div>Import data to:</div>
                <input type="radio" name="destination"/>
                <div>My Inventory</div>
              </div>
              <div className="radio">
                <div/>
                <input type="radio" name="destination"/>
                <div>My Project</div>
              </div>
              <Dropzone onDrop={this.onDrop}>
                <div>Try dropping some files here, or click to select files to upload.</div>
              </Dropzone>
            </form>
          )}
          closeModal={buttonText => {
            alert('close modal')
          }}
        />);

      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
  };
}

export default connect(mapStateToProps, {

})(ImportGenBankModal);
