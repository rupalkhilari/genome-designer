import React, { Component, PropTypes } from 'react';
import { sbol as sbolDragType } from '../../constants/DragTypes';
import inventorySbol from '../../inventory/sbol';
import BlockDefinition from '../../schemas/Block';
import merge from 'lodash.merge';

import InventoryList from './InventoryList';

export default class InventoryGroupSbol extends Component {
  constructor(props) {
    super(props);

    this.items = inventorySbol.map(symbol => merge(BlockDefinition.scaffold(), {
      id: symbol.id,
      metadata: {
        name: symbol.name,
        image: symbol.images.thick,
      },
    }));
  }

  render() {
    return (
      <div className="InventoryGroup-content InventoryGroupSbol">
        <InventoryList inventoryType={sbolDragType}
                       items={this.items}/>
      </div>
    );
  }
}
