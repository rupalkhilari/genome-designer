import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { blockCreate, blockClone, blockAddComponent, blockSetSbol } from '../actions/blocks';
import { DropTarget } from 'react-dnd';
import { block as blockDragType, sbol as sbolDragType, inventoryItem as inventoryItemDragType } from '../constants/DragTypes';

import SketchBlock from '../components/SketchBlock';

/**
 @name SketchConstruct
 @description SketchConstruct is the parent element for drawing a construct.
 */

const constructTarget = {
  drop(props, monitor) {
    const { item, type } = monitor.getItem();

    if (type === blockDragType) {
      props.blockClone(item).then(block => {
        props.blockAddComponent(props.construct.id, block.id);
      });
    } else if (type === sbolDragType) {
      const blockId = props.construct.components[0]; //todo - get the right block
      console.log('SBOL:', blockId, ' ', item.id);
      props.blockSetSbol(blockId, item.id);
    } else {
      // ?
    }
  },
};

@DropTarget(inventoryItemDragType, constructTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop(),
}))
export class SketchConstruct extends Component {
  static propTypes = {
    construct: PropTypes.object.isRequired,
    components: PropTypes.array.isRequired,

    connectDropTarget: PropTypes.func.isRequired,
    isOver: PropTypes.bool.isRequired,
    canDrop: PropTypes.bool.isRequired,
    lastDroppedItem: PropTypes.object,

    blockCreate: PropTypes.func.isRequired,
    blockClone: PropTypes.func.isRequired,
    blockAddComponent: PropTypes.func.isRequired,
    blockSetSbol: PropTypes.func.isRequired,
  };

  handleClickAddBlock = (event) => {
    const { construct, blockCreate, blockAddComponent } = this.props;
    blockCreate()
      .then(block => {
        blockAddComponent(construct.id, block.id);
      });
  }

  render() {
    const { construct, components, connectDropTarget } = this.props;

    return connectDropTarget(
      <div>
        <div ref="constructTitle"
             className="SketchPart">
          {construct.metadata.name || 'My Construct'}
        </div>
        <div ref="constructComponents"
             className="SketchBlock">
          {components.map(comp =>
            <SketchBlock key={comp.id}
                         block={comp}/>
          )}
        </div>
        <div ref="constructActions"
             className="SketchPart"
             onClick={this.handleClickAddBlock}>
          Add Block
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  const components = props.construct.components.map(componentId => state.blocks[componentId]);

  return {
    components,
  };
}

export default connect(mapStateToProps, {
  blockCreate,
  blockClone,
  blockAddComponent,
  blockSetSbol,
})(SketchConstruct);
