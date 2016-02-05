import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { blockMerge, blockSetColor, blockSetSbol, blockRename } from '../actions/blocks';
import InputSimple from './InputSimple';
import ColorPicker from './ui/ColorPicker';
import SymbolPicker from './ui/SymbolPicker';

//for now, assumes only blocks. Later, may need to pass a type as well

export class InspectorBlock extends Component {
  static propTypes = {
    instance: PropTypes.object.isRequired,
    currentBlocks: PropTypes.array,
    blockSetColor: PropTypes.func.isRequired,
    blockSetSbol: PropTypes.func.isRequired,
    blockMerge: PropTypes.func.isRequired,
    blockRename: PropTypes.func.isRequired,
  };

  setBlockName = (name) => {
    this.props.currentBlocks.forEach((blockId) => {
      this.props.blockRename(blockId, name);
    });
  };

  setBlockDescription = (description) => {
    this.props.currentBlocks.forEach((blockId) => {
      this.props.blockMerge(blockId, {metadata: {description}});
    });
  };

  selectColor = (color) => {
    this.props.currentBlocks.forEach((blockId) => {
      this.props.blockSetColor(blockId, color);
    });
  };

  selectSymbol = (symbol) => {
    this.props.currentBlocks.forEach((blockId) => {
      this.props.blockSetSbol(blockId, symbol);
    });
  };

  render() {
    const { instance } = this.props;

    let cb = '';
    if (this.props.currentBlocks) {
      cb = this.props.currentBlocks.reduce((memo, block) => {
        return memo + ' --- ' + block;
      }, '');
    }

    return (
      <div className="InspectorContent InspectorContentBlock">
        <h4 className="InspectorContent-heading">Name</h4>
        <InputSimple placeholder="Part Name"
                     onChange={this.setBlockName}
                     value={instance.metadata.name}/>

        <h4 className="InspectorContent-heading">Description</h4>
        <InputSimple placeholder="Part Description"
                     useTextarea
                     onChange={this.setBlockDescription}
                     updateOnBlur
                     value={instance.metadata.description}/>

        <h4 className="InspectorContent-heading">Sequence Length</h4>
        <p><strong>{instance.sequence.length ? (instance.sequence.length + ' bp') : 'No Sequence'}</strong></p>

        <h4 className="InspectorContent-heading">Color</h4>
        <ColorPicker current={instance.metadata.color}
                     onSelect={this.selectColor}/>

        <h4 className="InspectorContent-heading">Symbol</h4>
        <SymbolPicker current={instance.rules.sbol}
                      onSelect={this.selectSymbol}/>

        <h4 className="InspectorContent-heading">Selected Blocks</h4>
        <textarea style={{color: 'black'}} value={cb}></textarea>
      </div>
    );
  }
}

export default connect(() => ({}), {
  blockSetColor,
  blockSetSbol,
  blockRename,
  blockMerge,
})(InspectorBlock);
