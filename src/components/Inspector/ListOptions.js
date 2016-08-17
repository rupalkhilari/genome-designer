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
import { blockOptionsToggle } from '../../actions/blocks';

import '../../styles/ListOptions.css';

export class ListOptions extends Component {
  static propTypes = {
    block: PropTypes.shape({
      id: PropTypes.string.isRequired,
      options: PropTypes.object.isRequired,
    }).isRequired,
    optionBlocks: PropTypes.array.isRequired,
    blockOptionsToggle: PropTypes.func.isRequired,
    isAuthoring: PropTypes.bool.isRequired,
  };

  onSelectOption = (option) => {
    this.props.blockOptionsToggle(this.props.block.id, option.id);
  };

  render() {
    const { block, optionBlocks } = this.props;
    const { options } = block;
    const isFrozen = block.isFrozen();

    return (
      <div className={'ListOptions no-vertical-scroll' + (isFrozen ? ' isFrozen' : '')}>
        {isFrozen && <div className="ListOptions-explanation">List items cannot be modified after they have been frozen. Duplicate the template to make changes.</div>}
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
})(ListOptions);
