import React, { Component, PropTypes } from 'react';
import parts from '../../inventory/andrea/parts';
import InventoryList from '../Inventory/InventoryList';
import { get as pathGet } from 'lodash';

export default class ListOptions extends Component {
  static propTypes = {
    block: PropTypes.shape({
      rules: PropTypes.shape({
        filter: PropTypes.object.isRequired,
      }).isRequired,
    }).isRequired,
  };

  render() {
    const { block } = this.props;
    const { filter } = block.rules;

    const filtered = parts.filter(part => {
      return Object.keys(filter).every(key => {
        const value = filter[key];
        return pathGet(part, key) === value;
      });
    });

    return (<InventoryList items={filtered} />);
  }
}
