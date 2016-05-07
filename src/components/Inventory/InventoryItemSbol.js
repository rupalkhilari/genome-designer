import React, { Component, PropTypes } from 'react';
import { sbol as sbolDragType } from '../../constants/DragTypes';
import Block from '../../models/Block';

import InventoryItem from './InventoryItem';

//note - if we know we have a (non-construct) block as inventory item, then we dont need to do any transactions / deep cloning - inventory drag + drop is straight forward. Use InventoryConstruct if you have a block that may be a construct (with components) OR a block.

export default class InventoryItemSbol extends Component {
  static propTypes = {
    sbol: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      images: PropTypes.object.isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);

    const symbol = this.props.sbol;

    //make this a block so that it shows up in the inspector properly
    this.sbol = new Block({
      id: symbol.id,
      metadata: {
        name: symbol.name,
        image: symbol.images.thin,
        color: null,
        isSBOL: true,
      },
      rules: {
        sbol: symbol.id,
      },
      source: {
        source: 'SBOL',
      },
    });
  }

  render() {
    const { sbol, ...rest } = this.props;

    return (
      <div className="InventoryItemSbol">
        <InventoryItem {...rest}
          inventoryType={sbolDragType}
          item={this.sbol}/>
      </div>
    );
  }
}
