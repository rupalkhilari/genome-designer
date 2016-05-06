import React, { Component, PropTypes } from 'react';
import inventorySbol from '../../inventory/sbol';

import InventoryItemSbol from './InventoryItemSbol';

export default class InventoryGroupSbol extends Component {
  constructor(props) {
    super(props);

    this.sbols = inventorySbol;
  }

  render() {
    return (
      <div className="InventoryGroup-content InventoryGroupSbol">
        {this.sbols.map(item => (
          <InventoryItemSbol key={item.id}
                             sbol={item}/>
        ))}
      </div>
    );
  }
}
