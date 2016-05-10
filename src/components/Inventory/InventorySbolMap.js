import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { blockStash } from '../../actions/blocks';
import { block as blockDragType } from '../../constants/DragTypes';
import { infoQuery } from '../../middleware/api';
import { symbolMap } from '../../inventory/sbol';

import InventoryConstruct from './InventoryConstruct';
import InventoryListGroup from './InventoryListGroup';
import InventoryList from './InventoryList';

//this component expects the project to be available in the store, but not necessarily its components. It handles loading the project's components and adding them to the store.

export default class InventorySbolMap extends Component {
  static propTypes = {
    blockStash: PropTypes.func.isRequired,
  };

  state = {
    loadedTypes: {},
    typeMap: {},
  };

  componentDidMount() {
    //returns a map { <sbolkey> : number }
    infoQuery('sbol').then(typeMap => this.setState({ typeMap }));
  }

  onToggleType = (nextState, type) => {
    if (!nextState) return;
    //no caching for now...
    //when update to a cache, this should live update (right now, updates only when change tabs)

    //returns an array of blocks
    infoQuery('sbol', type).then(blocks => this.setState({
      loadedTypes: Object.assign(this.state.loadedTypes, { [type]: blocks }),
    }));
  };

  onBlockDrop = (item, target) => {
    //if no components, dont need to worry about fetching them
    if (!item.components.length) {
      return Promise.resolve(item);
    }

    //get components if its a construct and add blocks to the store
    //note - this may be a very large query
    return infoQuery('components', item.id)
      .then(componentsObj => {
        //this object is a map of { <blockId> : <block> }, including the item itself
        const components = Object.keys(componentsObj).map(key => componentsObj[key]);
        return this.props.blockStash(...components);
      })
      .then(() => item);
  };

  render() {
    const { typeMap, loadedTypes } = this.state;

    return (
      <div className="InventorySbolMap">
        {Object.keys(typeMap).map(type => {
          const count = typeMap[type];
          const name = symbolMap[type] || type;
          const items = loadedTypes[type] || [];
          return (
            <InventoryListGroup key={type}
                                title={name + ` (${count})`}
                                onToggle={(nextState) => this.onToggleType(nextState, type)}>
              <InventoryList inventoryType={blockDragType}
                             onDrop={this.onBlockDrop}
                             items={items}/>
            </InventoryListGroup>
          );
        })}
      </div>
    );
  }
}

export default connect(() => ({}), {
  blockStash,
})(InventorySbolMap);
