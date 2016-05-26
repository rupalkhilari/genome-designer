import React, { Component } from 'react';
import inventoryRoles from '../../inventory/roles';

import InventoryItemRole from './InventoryItemRole';

export default class InventoryGroupRole extends Component {
  constructor(props) {
    super(props);

    this.roleSymbols = inventoryRoles;
  }

  render() {
    return (
      <div className="InventoryGroup-content InventoryGroupRole">
        {this.roleSymbols.map(item => (
          <InventoryItemRole key={item.id}
                             role={item}/>
        ))}
      </div>
    );
  }
}
