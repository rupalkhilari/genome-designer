import React, { Component, PropTypes } from 'react';

import '../../styles/InventoryItem.css';

export default class InventoryItem extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
  }

  render() {
    return (
      <div className="InventoryItem">
        {this.props.item}
      </div>
    );
  }
}
