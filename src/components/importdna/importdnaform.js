import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux';
import { uiShowDNAImport } from '../../actions/ui';
import invariant from 'invariant';
import ModalWindow from '../modal/modalwindow';

import '../../../src/styles/form.css';
import '../../../src/styles/importdnaform.css';

class DNAImportForm extends Component {

  static propTypes = {
    uiShowDNAImport: PropTypes.func.isRequired,
  };

  constructor() {
    super();
  }

  render() {
    return (
      <ModalWindow
        open={this.props.open}
        title="Import DNA Sequence"
        closeOnClickOutside
        closeModal={(buttonText) => {
          this.props.uiShowDNAImport(false);
        }}
        payload={
          <form className="gd-form importdnaform">
            <div className="title">Import DNA Sequence</div>
            <textarea ref="rawSequenceInput"/>
          </form>
        }
      />
    );
  }
}

function mapStateToProps(state) {
  console.log("SHOW DNA IMPORT:", state.ui.showDNAImport);
  return {
    open: state.ui.showDNAImport,
  };
}

export default connect(mapStateToProps, {
  uiShowDNAImport,
})(DNAImportForm);
