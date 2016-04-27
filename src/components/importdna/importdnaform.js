import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { uiShowDNAImport } from '../../actions/ui';
import { blockGetSequence, blockSetSequence } from '../../actions/blocks';
import { focusBlocks } from '../../actions/focus';
import { uiSetGrunt } from '../../actions/ui';
import invariant from 'invariant';
import ModalWindow from '../modal/modalwindow';
import { blockCreate, blockAddComponent } from '../../actions/blocks';
import { dnaLoose } from '../../utils/dna/dna';

import '../../../src/styles/form.css';
import '../../../src/styles/importdnaform.css';

class DNAImportForm extends Component {

  static propTypes = {
    uiShowDNAImport: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
  };

  constructor() {
    super();
    this.state = {
      inputValid: true,
      validLength: 0,
    };
  }

  onSequenceChanged(evt) {
    const source = evt.target.value;
    if (source) {
      // strip anything except atgc and whitespace
      const cleanRegex = new RegExp(`[^${dnaLoose}]`, 'gmi');
      // while cleaning convert to lowercase
      const clean = source.replace(cleanRegex, '').toLowerCase();
      if (clean !== source) {
        evt.target.value = clean;
      }
      // check for valid sequence
      // ( you should not be able to enter an invalid sequence but just in case )
      const dnaRegex = new RegExp(`^([${dnaLoose}]*)$`, 'gi');
      const isValid = dnaRegex.test(clean);
      this.setState({
        inputValid: isValid,
        validLength: clean.length,
        sequence: clean.toUpperCase(),
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

    return (<ModalWindow
      open={this.props.open}
      title="Add Sequence"
      closeOnClickOutside
      closeModal={(buttonText) => {
          this.props.uiShowDNAImport(false);
        }}
      payload={
          <form className="gd-form importdnaform" onSubmit={this.onSubmit.bind(this)}>
            <div className="title">Add Sequence</div>
            <textarea
              style={{textTransform: 'uppercase'}}
              placeholder="Type or paste DNA sequence data here."
              rows="10"
              autoComplete="off"
              autoFocus
              maxLength="10000000"
              spellCheck="false"
              ref="sequenceTextArea"
              defaultValue={this.state.sequence}
              onChange={this.onSequenceChanged.bind(this)}/>
            <label style={{textAlign: 'right'}}>{`Length: ${this.state.validLength}`}</label>
            <div className={`error ${!this.state.inputValid ? 'visible' : ''}`}>The sequence is not valid</div>
            <div style={{width: '75%', textAlign: 'center'}}>
              <button type="submit" disabled={!(this.state.inputValid && this.state.validLength)}>Add</button>
              <button
                type="button"
                onClick={() => {
                  this.props.uiShowDNAImport(false);
                }}>Cancel
              </button>
            </div>
          </form>}

    />);
  };
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
