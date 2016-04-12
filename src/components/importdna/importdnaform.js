import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux';
import { uiShowDNAImport } from '../../actions/ui';
import { blockGetSequence, blockSetSequence } from '../../actions/blocks';
import { focusBlocks } from '../../actions/focus';
import { uiSetGrunt } from '../../actions/ui';
import invariant from 'invariant';
import ModalWindow from '../modal/modalwindow';
import { blockCreate, blockAddComponent } from '../../actions/blocks';

import '../../../src/styles/form.css';
import '../../../src/styles/importdnaform.css';

class DNAImportForm extends Component {

  static propTypes = {
    uiShowDNAImport: PropTypes.func.isRequired,
  };

  constructor() {
    super();
    this.state = {
      inputValid: true,
      validLength: 0,
    }
  }

  onSequenceChanged(evt) {
    const source = evt.target.value;
    if (source) {
      // strips various flavors of line break and white space
      const cleanRegex = /(\r|\r\n|\n|\s+)/gmi;
      // while cleaning convert to lowercase
      const clean = source.replace(cleanRegex, '').toLowerCase();
      // check for valid sequence
      const dnaRegex = /^([atgc]+)$/;
      const isValid = dnaRegex.test(clean);
      this.setState({
        inputValid: isValid,
        validLength: clean.length,
        sequence: clean,
      });
    } else {
      this.setState({
        inputValid: true,
        validLength: 0,
        sequence: null,
      });
    }
  }

  setSequenceAndClose(blockId, sequence) {
    this.props.blockSetSequence(blockId, sequence)
      .then(block => {
        // close the dialog, focus the block we inserted into and message the user.
        this.props.uiShowDNAImport(false);
        this.props.focusBlocks([blockId]);
        this.props.uiSetGrunt(`Sequence was successfully inserted.`);
      })
      .catch(reason => {
        // show the error dialog
        this.props.uiShowDNAImport(false);
        this.props.uiSetGrunt(`There was a problem inserting that DNA: ${reason.toString()}`);
      });
  }

  onSubmit(evt) {
    evt.preventDefault();
    // be sure we have a valid sequence before continuing
    if (this.state.inputValid
      && this.state.validLength
      && this.state.sequence
      && this.state.validLength === this.state.sequence.length) {

        // get the currently selected blocks from the store
        let done = false;
        Promise.all(this.props.focusedBlocks.map(blockId => {
          return this.props.blockGetSequence(blockId);
        }))
          .then(sequences => {
            // get index of first empty sequence
            const emptyIndex = sequences.findIndex(sequence => !sequence);
            if (emptyIndex >= 0) {
              this.setSequenceAndClose(this.props.focusedBlocks[emptyIndex], this.state.sequence);
            } else {
              const block = this.props.blockCreate();
              this.props.blockAddComponent(this.props.currentConstruct, block.id, 0);
              this.setSequenceAndClose(block.id, this.state.sequence);
            }
          })
          .catch(reason => {
            // close the dialog
            this.props.uiShowDNAImport(false);
            this.props.uiSetGrunt(`There was a problem fetching the block sequences: ${reason.toString()}`);
          });
    }
  }

  render() {

    // no render when not open
    if (!this.props.open) {
      return null;
    }

    let payload = null;
    if (this.props.currentConstruct && this.props.focusedBlocks.length) {
      payload=(
        <form className="gd-form importdnaform" onSubmit={this.onSubmit.bind(this)}>
          <div className="title">Import DNA Sequence</div>
          <label>{this.state.validLength
              ? `Sequence Length: ${this.state.validLength}`
              : "Paste your sequence into the box below."}
            </label>
          <textarea
            rows="10"
            autoComplete="off"
            autoFocus
            maxLength="10000000"
            spellCheck="false"
            ref="sequenceTextArea"
            defaultValue={this.state.sequence}
            onChange={this.onSequenceChanged.bind(this)}/>
          <div className={`error ${!this.state.inputValid ? 'visible' : ''}`}>The sequence is not valid</div>
          <br/>
          <button type="submit" disabled={!(this.state.inputValid && this.state.validLength)}>Import</button>
          <button
            type="button"
            onClick={() => {
              this.props.uiShowDNAImport(false);
            }}>Cancel</button>
        </form>
      )
    } else {
      payload = (
        <form className="gd-form importdnaform" onSubmit={this.onSubmit.bind(this)}>
          <div className="title">Import DNA Sequence</div>
          <label>Please select at least one block first.</label>
          <br/>
          <button
            type="submit"
            onClick={(evt) => {
              evt.preventDefault();
              this.props.uiShowDNAImport(false);
            }}>Close</button>
        </form>
      )
    }

    return (
      <ModalWindow
        open={this.props.open}
        title="Import DNA Sequence"
        closeOnClickOutside
        closeModal={(buttonText) => {
          this.props.uiShowDNAImport(false);
        }}
        payload={payload}
      />
    );
  }
}

function mapStateToProps(state) {

  return {
    open: state.ui.showDNAImport,
    focusedBlocks: state.focus.blocks,
    currentConstruct: state.focus.construct,
  };
}

export default connect(mapStateToProps, {
  uiShowDNAImport,
  blockGetSequence,
  blockSetSequence,
  uiSetGrunt,
  blockCreate,
  blockAddComponent,
  focusBlocks,
})(DNAImportForm);
