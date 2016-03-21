import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { blockMerge, blockSetColor, blockSetSbol, blockRename } from '../actions/blocks';
import InputSimple from './InputSimple';
import ColorPicker from './ui/ColorPicker';
import SymbolPicker from './ui/SymbolPicker';

export class InspectorBlock extends Component {
  static propTypes = {
    readOnly: PropTypes.bool.isRequired,
    instances: PropTypes.array.isRequired,
    blockSetColor: PropTypes.func.isRequired,
    blockSetSbol: PropTypes.func.isRequired,
    blockMerge: PropTypes.func.isRequired,
    blockRename: PropTypes.func.isRequired,
  };

  setBlockName = (name) => {
    this.props.instances.forEach((block) => {
      this.props.blockRename(block.id, name);
    });
  };

  setBlockDescription = (description) => {
    this.props.instances.forEach((block) => {
      this.props.blockMerge(block.id, {metadata: {description}});
    });
  };

  selectColor = (color) => {
    this.props.instances.forEach((block) => {
      this.props.blockSetColor(block.id, color);
    });
  };

  selectSymbol = (symbol) => {
    this.props.instances.forEach((block) => {
      this.props.blockSetSbol(block.id, symbol);
    });
  };

  /**
   * color of selected instance or null if multiple blocks selected
   */
  currentColor() {
    if (this.props.instances.length === 1) {
      return this.props.instances[0].metadata.color;
    }
    return null;
  }

  /**
   * sbol symbol of selected instance or null if multiple blocks selected
   */
  currentSbolSymbol() {
    if (this.props.instances.length === 1) {
      return this.props.instances[0].rules.sbol;
    }
    return null;
  }

  /**
   * current name of instance or null if multi-select
   */
  currentName() {
    if (this.props.instances.length === 1) {
      return this.props.instances[0].metadata.name;
    }
    return null;
  }

  /**
   * current name of instance or null if multi-select
   */
  currentDescription() {
    if (this.props.instances.length === 1) {
      return this.props.instances[0].metadata.description;
    }
    return null;
  }

  currentSequenceLength() {
    if (this.props.instances.length > 1) {
      const allHaveSequences = this.props.instances.every(instance => instance.sequence.length);
      if (allHaveSequences) {
        const reduced = this.props.instances.reduce((acc, instance) => acc + (instance.sequence.length || 0), 0);
        return reduced + ' bp';
      }
      return 'Incomplete Sketch';
    } else if (this.props.instances.length === 1) {
      const length = this.props.instances[0].sequence.length;
      return (length > 0 ? (length + ' bp') : 'No Sequence');
    }
    return 'No Sequence';
  }

  render() {
    const { readOnly } = this.props;

    return (
      <div className="InspectorContent InspectorContentBlock">
        <h4 className="InspectorContent-heading">Name</h4>
        <InputSimple placeholder="Part Name"
                     readOnly={readOnly}
                     onChange={this.setBlockName}
                     value={this.currentName()}/>

        <h4 className="InspectorContent-heading">Description</h4>
        <InputSimple placeholder="Part Description"
                     useTextarea
                     readOnly={readOnly}
                     onChange={this.setBlockDescription}
                     updateOnBlur
                     value={this.currentDescription()}/>

        <h4 className="InspectorContent-heading">Sequence Length</h4>
        <p><strong>{this.currentSequenceLength()}</strong></p>

        <h4 className="InspectorContent-heading">Color</h4>
        <ColorPicker current={this.currentColor()}
                     readOnly={readOnly}
                     onSelect={this.selectColor}/>

        <h4 className="InspectorContent-heading">Symbol</h4>
        <SymbolPicker current={this.currentSbolSymbol()}
                      readOnly={readOnly}
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
