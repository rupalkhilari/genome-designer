import React, { Component, PropTypes } from 'react';

import styles from '../../styles/InventoryItem.css';
import withStyles from '../../decorators/withStyles';

@withStyles(styles)
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
