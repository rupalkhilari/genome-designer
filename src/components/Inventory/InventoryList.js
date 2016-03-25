import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {transact, commit} from '../../store/undo/actions';

import InventoryItem from './InventoryItem';

import '../../styles/InventoryList.css';

export class InventoryList extends Component {
  static propTypes = {
    inventoryType: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
    })).isRequired,
    onDrop: PropTypes.func,
    onSelect: PropTypes.func,
    transact: PropTypes.func,
    commit: PropTypes.func,
  };

  render() {
    const { items, inventoryType, onDrop, onSelect, transact, commit } = this.props;

    return (
      <div className="InventoryList">
        {items.map(item => {
          return (
            <InventoryItem key={item.id}
                           inventoryType={inventoryType}
                           onDragStart={transact}
                           onDragComplete={commit}
                           onDrop={onDrop}
                           onSelect={onSelect}
                           item={item}/>
          );
        })}
      </div>
    );
  }
}

export default connect(() => ({}), {
  transact,
  commit,
})(InventoryList);
