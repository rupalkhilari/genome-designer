import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux';
import invariant from 'invariant';
import ModalWindow from '../modal/modalwindow';

import '../../../src/styles/genbank.css';

class ImportGenBankModal extends Component {

  static propTypes = {

  };

  constructor() {
    super();
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
