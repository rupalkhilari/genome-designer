import React, { Component, PropTypes } from 'react';

import InventoryItem from './InventoryItem';

import '../../styles/InventoryList.css';

export default class InventoryList extends Component {
  static propTypes = {
    inventoryType: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
    })).isRequired,
    onDrop: PropTypes.func,
  };

  render() {
    const { items, inventoryType, onDrop } = this.props;

    return (
      <div className="InventoryList">
        {items.map(item => {
          return (
            <InventoryItem key={item.id}
                           inventoryType={inventoryType}
                           onDrop={onDrop}
                           item={item}/>
          );
        })}
      </div>
    );
  }
}
