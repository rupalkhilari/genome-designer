import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
import DnD from '../../containers/graphics/dnd/dnd';
import MouseTrap from '../../containers/graphics/mousetrap';

import { inspectorToggleVisibility, inspectorForceBlocks } from '../../actions/inspector';

import '../../styles/InventoryItem.css';

export class InventoryItem extends Component {
  static propTypes = {
    inventoryType: PropTypes.string.isRequired,
    item: PropTypes.shape({
      metadata: PropTypes.shape({
        name: PropTypes.string.isRequired,
        image: PropTypes.string,
      }).isRequired,
    }).isRequired,
    onDrop: PropTypes.func,
    onSelect: PropTypes.func,
    inspectorToggleVisibility: PropTypes.func.isRequired,
    inspectorForceBlocks: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const dom = ReactDOM.findDOMNode(this);
    this.mouseTrap = new MouseTrap({
      element: dom,
      mouseDrag: this.mouseDrag.bind(this),
    });
  }

  mouseDrag(event, localPosition, startPosition, distance) {
    // cancel mouse drag and start a drag and drop
    this.mouseTrap.cancelDrag();
    // get global point as starting point for drag
    const globalPoint = this.mouseTrap.mouseToGlobal(event);
    // start DND
    DnD.startDrag(this.makeDnDProxy(), globalPoint, {
      item: this.props.item,
      type: this.props.inventoryType,
    }, {
      onDrop: (target, position) => {
        if (this.props.onDrop) {
          return this.props.onDrop(this.props.item, target, position);
        }
      },
    });
  }

  handleClick = () => {
    //todo - promise - get more data first
    //todo - add class selected, based on inspector current blocks
    const { item, onSelect, inspectorToggleVisibility, inspectorForceBlocks } = this.props;

    const promise = (!!onSelect) ? onSelect(item) : Promise.resolve(item);

    promise.then(result => {
      inspectorForceBlocks([result]);
      inspectorToggleVisibility(true);
    });
  };

  /**
   * make a drag and drop proxy for the item
   */
  makeDnDProxy() {
    const proxy = document.createElement('span');
    proxy.classList.add('InventoryItemProxy');
    proxy.innerHTML = this.props.item.metadata.name;
    return proxy;
  }

  render() {
    const item = this.props.item;
    const imagePath = item.metadata.image;

    return (
      <div className={'InventoryItem' +
        (!!imagePath ? ' hasImage' : '')}>
        <a className="InventoryItem-item"
           onClick={this.handleClick}>
          {!!imagePath && <img className="InventoryItem-image" src={imagePath}/> }
          <span className="InventoryItem-text">
            {item.metadata.name || 'Unnamed'}
          </span>
        </a>
      </div>
    );
  }
}

export default connect(() => ({}), {
  inspectorForceBlocks,
  inspectorToggleVisibility,
})(InventoryItem);
