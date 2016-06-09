import React, { Component, PropTypes } from 'react';
import { role as roleDragType } from '../../constants/DragTypes';
import Block from '../../models/Block';

import InventoryItem from './InventoryItem';

//note - if we know we have a (non-construct) block as inventory item, then we dont need to do any transactions / deep cloning - inventory drag + drop is straight forward. Use InventoryConstruct if you have a block that may be a construct (with components) OR a block.

export default class InventoryItemRole extends Component {
  static propTypes = {
    role: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      images: PropTypes.object.isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);

    //this comes from inventory/roles.js
    const symbol = this.props.role;

    //make this a block so that it shows up in the inspector properly
    this.roleBlock = new Block({
      id: symbol.id,
      metadata: {
        name: symbol.name,
        image: symbol.images.thin,
        color: null,
      },
      rules: {
        role: symbol.id,
      },
    });
  }

  render() {
    const { role, ...rest } = this.props;

    return (
      <div className="InventoryItemRole">
        <InventoryItem {...rest}
          inventoryType={roleDragType}
          svg={role.id}
          item={this.roleBlock}
          dataAttribute={`sbol ${role.id}`}/>
      </div>
    );
  }
}
