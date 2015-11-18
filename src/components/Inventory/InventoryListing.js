import React, { Component, PropTypes } from 'react';

import InventoryItem from './InventoryItem';

import '../../styles/InventoryListing.css';

export default class InventoryListing extends Component {
  static propTypes = {
    items: PropTypes.array.isRequired,
  }

  render() {
    return (
      <div className="InventoryListing">
        {this.props.items.map(item => {
          return (
            <InventoryItem key={item}
                           item={item}/>
          );
        })}
      </div>
    );
  }
}
