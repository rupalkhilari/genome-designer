import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux';
import invariant from 'invariant';
import ModalWindow from '../modal/modalwindow';

class ImportGenBankModal extends Component {

  static propTypes = {

  };

  constructor() {
    super();
  }

  render() {
    return null;
    
    return (
      <div>
        <ModalWindow
          open
          title="Import GenBank File"
          payload={
            <h1>Import GenBank Modal</h1>
          }
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
