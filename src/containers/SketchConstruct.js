import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { blockCreate, blockAddComponent } from '../actions/blocks';
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
      // fixme
      // really, we just need to add it to the store...
      // going to leave for now... let's discuss how to handle
      // do we just want an action to associate a block with the store, since this isn't really creating it if its coming from the inventory?
      // do we want to clone inventory?
      // What happens when you pull something from inventory to associate with your project?
      // doing this will use the provided ID, and cause problems in the store

      const block = props.blockCreate(item);
      props.blockAddComponent(props.construct.id, block.id);
    } else if (type === sbolDragType) {
      console.log(item); //eslint-disable-line
      //todo - assign type to the block, likely using block.rules ...
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
    blockAddComponent: PropTypes.func.isRequired,
  };

  handleClickAddBlock = (event) => {
    const { construct, blockCreate, blockAddComponent } = this.props;
    const block = blockCreate();
    blockAddComponent(construct.id, block.id);
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
  blockAddComponent,
})(SketchConstruct);
