import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux';
import { uiShowDNAImport } from '../../actions/ui';
import { blockGetSequence, blockSetSequence } from '../../actions/blocks';
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

  componentWillReceiveProps(nextProps) {
    if (!this.props.open && nextProps.open) {
      // reset on opening
      this.setState({
        inputValid: true,
        validLenth: 0,
        sequence: null,
      });
      if (this.refs && this.refs.sequenceTextArea) {
        this.refs.sequenceTextArea.value = '';
      }
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
        // close the dialog
        this.props.uiShowDNAImport(false);
        this.props.uiSetGrunt(`Sequence was inserted into block ${block.id}`);
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
              this.setSequenceAndClose(this.props.focusedBlocks[emptyIndex], name, this.state.sequence);
            } else {
              debugger;
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
    return (
      <ModalWindow
        open={this.props.open}
        title="Import DNA Sequence"
        closeOnClickOutside
        closeModal={(buttonText) => {
          this.props.uiShowDNAImport(false);
        }}
        payload={
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
        }
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
})(DNAImportForm);
