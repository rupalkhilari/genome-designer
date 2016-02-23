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

  /**
   * color of selected instance or null if multiple blocks selected
   */
  currentColor() {
    if (this.props.currentBlocks && this.props.currentBlocks.length > 1) {
      return null;
    }
    if (this.props.instance) {
      return this.props.instance.metadata.color;
    }
    return null;
  }

  /**
   * sbol symbol of selected instance or null if multiple blocks selected
   */
  currentSbolSymbol() {
    if (this.props.currentBlocks && this.props.currentBlocks.length > 1) {
      return null;
    }
    if (this.props.instance) {
      return this.props.instance.rules.sbol;
    }
    return null;
  }

  /**
   * current name of instance or null if multi-select
   */
  currentName() {
    if (this.props.currentBlocks && this.props.currentBlocks.length > 1) {
      return null;
    }
    if (this.props.instance) {
      return this.props.instance.metadata.name;
    }
    return null;
  }

  /**
   * current name of instance or null if multi-select
   */
  currentDescription() {
    if (this.props.currentBlocks && this.props.currentBlocks.length > 1) {
      return null;
    }
    if (this.props.instance) {
      return this.props.instance.metadata.description;
    }
    return null;
  }

  render() {
    const { instance } = this.props;

    return (
      <div className="InspectorContent InspectorContentBlock">
        <h4 className="InspectorContent-heading">Name</h4>
        <InputSimple placeholder="Part Name"
                     onChange={this.setBlockName}
                     value={this.currentName()}/>

        <h4 className="InspectorContent-heading">Description</h4>
        <InputSimple placeholder="Part Description"
                     useTextarea
                     onChange={this.setBlockDescription}
                     updateOnBlur
                     value={this.currentDescription()}/>

        <h4 className="InspectorContent-heading">Sequence Length</h4>
        <p><strong>{instance.sequence.length ? (instance.sequence.length + ' bp') : 'No Sequence'}</strong></p>

        <h4 className="InspectorContent-heading">Color</h4>
        <ColorPicker current={this.currentColor()}
                     onSelect={this.selectColor}/>

        <h4 className="InspectorContent-heading">Symbol</h4>
        <SymbolPicker current={this.currentSbolSymbol()}
                      onSelect={this.selectSymbol}/>
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
