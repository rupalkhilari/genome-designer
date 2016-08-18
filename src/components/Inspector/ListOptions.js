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
import { blockStash, blockOptionsToggle, blockOptionsAdd } from '../../actions/blocks';
import { importGenbankOrCSV } from '../../middleware/genbank';
import CSVFileDrop from './CSVFileDrop';

import '../../styles/ListOptions.css';

export class ListOptions extends Component {
  static propTypes = {
    block: PropTypes.shape({
      id: PropTypes.string.isRequired,
      options: PropTypes.object.isRequired,
    }).isRequired,
    optionBlocks: PropTypes.array.isRequired,
    isAuthoring: PropTypes.bool.isRequired,
    blockOptionsToggle: PropTypes.func.isRequired,
    blockOptionsAdd: PropTypes.func.isRequired,
    blockStash: PropTypes.func.isRequired,
  };

  onSelectOption = (option) => {
    this.props.blockOptionsToggle(this.props.block.id, option.id);
  };

  handleCSVDrop = (files) => {
    importGenbankOrCSV(files[0], 'convert')
      .then(({ project, blocks }) => {
        this.props.blockStash(...Object.keys(blocks).map(blockId => blocks[blockId]));
        this.props.blockOptionsAdd(this.props.block.id, ...Object.keys(blocks));
      });
  };

  render() {
    const { block, optionBlocks, isAuthoring } = this.props;
    const { options } = block;
    const isFrozen = block.isFrozen();

    //todo - rethink scroll location
    return (
      <div className={'ListOptions no-vertical-scroll' + (isFrozen ? ' isFrozen' : '')}>
        {isFrozen && <div className="ListOptions-explanation">List items cannot be modified after they have been frozen. {isAuthoring ? 'Unfreeze the block to make changes.' : 'Duplicate the template to make changes.'}</div>}
        {!isFrozen && isAuthoring && <CSVFileDrop style={{marginBottom: '1em'}} onDrop={this.handleCSVDrop}/>}
        {optionBlocks.map(item => {
          return (
            <ListOption
              option={item}
              key={item.id}
              selected={options[item.id]}
              onClick={(option) => { if (!isFrozen) { this.onSelectOption(option); }}}/>
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
  blockOptionsToggle,
  blockOptionsAdd,
  blockStash,
})(ListOptions);
