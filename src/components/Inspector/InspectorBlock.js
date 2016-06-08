import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { transact, commit, abort } from '../../store/undo/actions';
import { blockMerge, blockSetColor, blockSetRole, blockRename } from '../../actions/blocks';
import { uiShowOrderForm } from '../../actions/ui';
import InputSimple from './../InputSimple';
import ColorPicker from './../ui/ColorPicker';
import Toggler from './../ui/Toggler';
import SymbolPicker from './../ui/SymbolPicker';
import BlockSource from './BlockSource';
import ListOptions from './ListOptions';
import OrderList from './OrderList';

export class InspectorBlock extends Component {
  static propTypes = {
    readOnly: PropTypes.bool.isRequired,
    instances: PropTypes.array.isRequired,
    orders: PropTypes.array.isRequired,
    blockSetColor: PropTypes.func.isRequired,
    blockSetRole: PropTypes.func.isRequired,
    blockMerge: PropTypes.func.isRequired,
    blockRename: PropTypes.func.isRequired,
    transact: PropTypes.func.isRequired,
    commit: PropTypes.func.isRequired,
    abort: PropTypes.func.isRequired,
    uiShowOrderForm: PropTypes.func.isRequired,
    forceIsConstruct: PropTypes.bool,
  };

  static defaultProps = {
    forceIsConstruct: false,
  };

  state = {
    toggles: {},
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
    this.startTransaction();
    this.props.instances.forEach((block) => {
      this.props.blockSetColor(block.id, color);
    });
    this.endTransaction();
  };

  selectSymbol = (symbol) => {
    this.startTransaction();
    this.props.instances.forEach((block) => {
      this.props.blockSetRole(block.id, symbol);
    });
    this.endTransaction();
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

  handleToggle = (field) => {
    const oldState = !!this.state.toggles[field];
    this.setState({ toggles: Object.assign({}, this.state.toggles, { [field]: !oldState }) });
  };

  handleOpenOrder = (orderId) => {
    this.props.uiShowOrderForm(true, orderId);
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
   * role symbol of selected instance or null if multiple blocks selected
   */
  currentRoleSymbol() {
    if (this.props.instances.length === 1) {
      return this.props.instances[0].rules.role;
    }
    //false is specially handled in symbol picker as blank, and is different than null (no symbol)
    return false;
  }

  /**
   * current name of instance or null if multi-select
   */
  currentName() {
    if (this.props.instances.length === 1) {
      return this.props.instances[0].metadata.name || this.props.instances[0].rules.role || '';
    }
    return '';
  }

  /**
   * current name of instance or null if multi-select
   */
  currentDescription() {
    if (this.props.instances.length === 1) {
      return this.props.instances[0].metadata.description || '';
    }
    return '';
  }

  allBlocksWithSequence() {
    return this.props.instances.every(instance => instance.sequence.length);
  }

  currentSequenceLength() {
    if (this.allBlocksWithSequence()) {
      const reduced = this.props.instances.reduce((acc, instance) => acc + (instance.sequence.length || 0), 0);
      return reduced + ' bp';
    }
    return this.props.instances.length > 1 ?
      'Incomplete Sketch' :
      'No Sequence';
  }

  currentAnnotations() {
    if (this.props.instances.length > 1) {
      return [];
    } else if (this.props.instances.length === 1) {
      return this.props.instances[0].sequence.annotations;
    }
    return [];
  }

  currentSource() {
    const lenInstances = this.props.instances.length;
    const firstBlock = this.props.instances[0];
    const firstSource = firstBlock.source;
    const { id: firstId, source: firstName } = firstSource;
    const firstHasSource = !!firstName;

    if (firstHasSource && (lenInstances === 1 ||
      this.props.instances.every(block => block.source.id === firstId && block.source.source === firstName))) {
      return (<BlockSource block={firstBlock}/>);
    }
    if (lenInstances > 1) {
      return (<p>Multiple Sources</p>);
    }
    return null;
  }

  render() {
    const { instances, orders, readOnly, forceIsConstruct } = this.props;
    const singleInstance = instances.length === 1;
    const isList = singleInstance && instances[0].isList();
    const isTemplate = singleInstance && instances[0].isTemplate();
    const isConstruct = singleInstance && instances[0].isConstruct();
    const inputKey = instances.map(inst => inst.id).join(',');

    const name = isTemplate ? 'Template' : (isConstruct ? 'Construct' : 'Block'); //eslint-disable-line no-nested-ternary

    const currentSourceElement = this.currentSource();
    const annotations = this.currentAnnotations();

    const hasSequence = this.allBlocksWithSequence();
    const hasNotes = singleInstance && Object.keys(instances[0].notes).length > 0;

    const relevantOrders = orders.filter(order => singleInstance && order.constructIds.indexOf(instances[0].id) >= 0);

    return (
      <div className="InspectorContent InspectorContentBlock">
        <h4 className="InspectorContent-heading">{name}</h4>
        <InputSimple refKey={inputKey}
                     placeholder="Enter a name"
                     readOnly={readOnly}
                     onChange={this.setBlockName}
                     onFocus={this.startTransaction}
                     onBlur={this.endTransaction}
                     onEscape={() => this.endTransaction(true)}
                     maxLength={64}
                     value={this.currentName()}/>

        <h4 className="InspectorContent-heading">Description</h4>
        <InputSimple refKey={inputKey + 'desc'}
                     placeholder="Enter a description"
                     useTextarea
                     readOnly={readOnly}
                     onChange={this.setBlockDescription}
                     onFocus={this.startTransaction}
                     onBlur={this.endTransaction}
                     onEscape={() => this.endTransaction(true)}
                     maxLength={1024}
                     value={this.currentDescription()}/>

        {currentSourceElement && <h4 className="InspectorContent-heading">Source</h4>}
        {currentSourceElement}

        {hasSequence && <h4 className="InspectorContent-heading">Sequence Length</h4>}
        {hasSequence && <p><strong>{this.currentSequenceLength()}</strong></p>}

        {hasNotes && (
          <h4 className={'InspectorContent-heading toggler' + (this.state.toggles.metadata ? ' active' : '')}
              onClick={() => this.handleToggle('metadata')}>
            <Toggler open={this.state.toggles.metadata}/>
            <span>{name} Metadata</span>
          </h4>
        )}
        {hasNotes && (<div className={'InspectorContent-section' + (this.state.toggles.metadata ? '' : ' closed')}>
          {Object.keys(this.props.instances[0].notes).map(key => {
            const note = this.props.instances[0].notes[key];
            return (
              <div className="InspectorContent-section-group alt-colors"
                   key={key}>
                <div className="InspectorContent-section-group-heading">{key}</div>
                <div className="InspectorContent-section-group-text">{note}</div>
              </div>
            );
          })}
        </div>)}

        {!!relevantOrders.length && (
          <h4 className={'InspectorContent-heading toggler' + (this.state.toggles.orders ? ' active' : '')}
              onClick={() => this.handleToggle('orders')}>
            <Toggler open={this.state.toggles.orders}/>
            <span>Order History</span>
          </h4>
        )}
        {!!relevantOrders.length && (
          <div className={'InspectorContent-section' + (this.state.toggles.orders ? '' : ' closed')}>
            <OrderList orders={relevantOrders}
                       onClick={(orderId) => this.handleOpenOrder(orderId)}/>
          </div>
        )}

        <h4 className="InspectorContent-heading">Color & Symbol</h4>
        <div className="InspectorContent-pickerWrap">
          <ColorPicker current={this.currentColor()}
                       readOnly={readOnly}
                       onSelect={this.selectColor}/>

          <SymbolPicker current={this.currentRoleSymbol()}
                        readOnly={readOnly || isConstruct || isTemplate || isList || forceIsConstruct}
                        onSelect={this.selectSymbol}/>
        </div>


        {!!annotations.length && (<h4 className="InspectorContent-heading">Annotations</h4>)}
        {!!annotations.length && (<div className="InspectorContentBlock-Annotations">
            {annotations.map((annotation, idx) => {
              return (
                <span className="InspectorContentBlock-Annotation"
                      key={idx}>
                {annotation.name || annotation.description || '?'}
              </span>
              );
            })}
          </div>
        )}

        {isList && (<h4 className="InspectorContent-heading">List Options</h4>)}
        {isList && (<ListOptions block={instances[0]}/>)}
      </div>
    );
  }
}

export default connect(() => ({}), {
  blockSetColor,
  blockSetRole,
  blockRename,
  blockMerge,
  transact,
  commit,
  abort,
  uiShowOrderForm,
})(InspectorBlock);
