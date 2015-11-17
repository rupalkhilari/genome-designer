import React, { Component, PropTypes } from 'react';

import InventoryItem from './InventoryItem';

import styles from '../../styles/InventoryListing.css';
import withStyles from '../../decorators/withStyles';

@withStyles(styles)
export default class InventoryListing extends Component {
  static propTypes = {
    items: PropTypes.array.isRequired,
  }

  render() {
    return (
      <div className="InventoryListing">
        {this.props.items.map(item => {
          return (
            <InventoryItem item={item} />
          );
        })}
      </div>
    );
  }
}
