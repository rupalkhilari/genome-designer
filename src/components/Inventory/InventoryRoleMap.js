import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { blockStash } from '../../actions/blocks';
import { block as blockDragType } from '../../constants/DragTypes';
import { infoQuery } from '../../middleware/api';
import { symbolMap } from '../../inventory/roles';

import InventoryListGroup from './InventoryListGroup';
import InventoryList from './InventoryList';
import Spinner from '../ui/Spinner';

export class InventoryRoleMap extends Component {
  static propTypes = {
    blockStash: PropTypes.func.isRequired,
  };

  state = {
    loadingMap: true,
    loadedTypes: {},
    typeMap: {},
  };

  componentDidMount() {
    //returns a map { <rolekey> : number }
    infoQuery('role').then(typeMap => this.setState({
      typeMap,
      loadingMap: false,
    }));
  }

  //null is for loading
  setRoleType(type, blocks = false) {
    this.setState({
      loadedTypes: Object.assign(this.state.loadedTypes, { [type]: blocks }),
    });
  }

  onToggleType = (nextState, type) => {
    if (!nextState) return;
    //no caching for now...
    //when update to a cache, this should live update (right now, updates only when change tabs)

    //loading
    this.setRoleType(type, false);

    //returns an array of blocks
    infoQuery('role', type)
      .then(blocks => this.setRoleType(type, blocks));
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
    const { typeMap, loadedTypes, loadingMap } = this.state;

    const content = loadingMap ?
      <Spinner /> :
      Object.keys(typeMap).map(type => {
        const count = typeMap[type];
        const name = symbolMap[type] || type;
        const items = loadedTypes[type] || [];
        const isLoading = loadedTypes[type] === false;
        return (
          <InventoryListGroup key={type}
                              title={name + ` (${count})`}
                              isLoading={isLoading}
                              onToggle={(nextState) => this.onToggleType(nextState, type)}>
            <InventoryList inventoryType={blockDragType}
                           onDrop={this.onBlockDrop}
                           items={items}/>
          </InventoryListGroup>
        );
      });

    return (
      <div className="InventoryRoleMap">
        {content}
      </div>
    );
  }
}

export default connect(() => ({}), {
  blockStash,
})(InventoryRoleMap);
