import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { transact, commit, abort } from '../store/undo/actions';
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
    transact: PropTypes.func.isRequired,
    commit: PropTypes.func.isRequired,
    abort: PropTypes.func.isRequired,
  };

  setBlockName = (name) => {
    this.props.instances.forEach((block) => {
      this.props.blockRename(block.id, name);
    });
  };

  setBlockDescription = (description) => {
    this.props.instances.forEach((block) => {
      this.props.blockMerge(block.id, { metadata: { description } });
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

  startTransaction = () => {
    this.props.transact();
  };

  endTransaction = (shouldAbort = false) => {
    if (shouldAbort === true) {
      this.props.abort();
      return;
    }
    this.props.commit();
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

  currentAnnotations() {
    if (this.props.instances.length > 1) {
      return [];
    } else if (this.props.instances.length === 1) {
      return this.props.instances[0].sequence.annotations;
    }
    return [];
  }

  render() {
    const { readOnly } = this.props;

    const annotations = this.currentAnnotations();

    return (
      <div className="InspectorContent InspectorContentBlock">
        <h4 className="InspectorContent-heading">Name</h4>
        <InputSimple placeholder="Part Name"
                     readOnly={readOnly}
                     onChange={this.setBlockName}
                     onFocus={this.startTransaction}
                     onBlur={this.endTransaction}
                     onEscape={() => this.endTransaction(true)}
                     value={this.currentName()}/>

        <h4 className="InspectorContent-heading">Description</h4>
        <InputSimple placeholder="Part Description"
                     useTextarea
                     readOnly={readOnly}
                     onChange={this.setBlockDescription}
                     onFocus={this.startTransaction}
                     onBlur={this.endTransaction}
                     onEscape={() => this.endTransaction(true)}
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


        {!!annotations.length && (<h4 className="InspectorContent-heading">Contents</h4>)}
        {!!annotations.length && (<div className="InspectorContentBlock-Annotations">
            {annotations.map(annotation => {
              return (
                <span className="InspectorContentBlock-Annotation">
                {annotation.name || annotation.description || '?'}
              </span>
              );
            })}
          </div>
        )}
      </div>
    );
  }
}

export default connect(() => ({}), {
  blockSetColor,
  blockSetSbol,
  blockRename,
  blockMerge,
  transact,
  commit,
  abort,
})(InspectorBlock);
