/*
Copyright 2016 Autodesk,Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import ListOption from './ListOption';
import { blockStash, blockOptionsToggle, blockOptionsAdd, blockOptionsRemove } from '../../actions/blocks';
import { importGenbankOrCSV } from '../../middleware/genbank';
import {
  uiShowPartsCSVImport,
} from '../../actions/ui';
//import CSVFileDrop from './CSVFileDrop';
//import '../../styles/CSVFileDrop.css';

import '../../styles/ListOptions.css';

export class ListOptions extends Component {
  static propTypes = {
    block: PropTypes.shape({
      id: PropTypes.string.isRequired,
      options: PropTypes.object.isRequired,
      isFrozen: PropTypes.func.isRequired,
    }).isRequired,
    optionBlocks: PropTypes.array.isRequired,
    toggleOnly: PropTypes.bool.isRequired,
    blockOptionsToggle: PropTypes.func.isRequired,
    blockOptionsAdd: PropTypes.func.isRequired,
    blockOptionsRemove: PropTypes.func.isRequired,
    blockStash: PropTypes.func.isRequired,
  };

  onSelectOption = (option) => {
    if (!this.props.block.isFrozen()) {
      this.props.blockOptionsToggle(this.props.block.id, option.id);
    }
  };

  onDeleteOption = (option) => {
    if (!this.props.block.isFrozen()) {
      this.props.blockOptionsRemove(this.props.block.id, option.id);
    }
  };

  handleCSVImport = (files) => {
    this.props.uiShowPartsCSVImport(true, this.props.block);
  };

  render() {
    const { block, optionBlocks, toggleOnly } = this.props;
    const { options } = block;
    const isFrozen = block.isFrozen();
    //const csvUploadButton = !isFrozen && !toggleOnly ? <CSVFileDrop style={{marginBottom: '1em'}} onDrop={this.handleCSVDrop}/> : null;
    const csvUploadButton = !isFrozen && !toggleOnly ? <div style={{marginBottom: '1em'}} className="CSVFileDrop" onClick={this.handleCSVImport}>Upload Parts (CSV)</div> : null;

    //todo - rethink scroll location
    return (
      <div className={'ListOptions no-vertical-scroll' + (isFrozen ? ' isFrozen' : '')}>
        {isFrozen && <div className="ListOptions-explanation">List items cannot be modified after they have been frozen. {!toggleOnly ? 'Unfreeze the block to make changes.' : 'Duplicate the template to make changes.'}</div>}
        {csvUploadButton}
        {optionBlocks.map(item => {
          return (
            <ListOption
              option={item}
              toggleOnly={!isFrozen && !toggleOnly}
              key={item.id}
              selected={options[item.id]}
              onDelete={(option) => this.onDeleteOption(option)}
              onClick={(option) => this.onSelectOption(option)}/>
          );
        })}
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  optionBlocks: Object.keys(props.block.options).map(id => state.blocks[id]),
});

export default connect(mapStateToProps, {
  uiShowPartsCSVImport,
  blockOptionsToggle,
  blockOptionsAdd,
  blockOptionsRemove,
  blockStash,
})(ListOptions);
