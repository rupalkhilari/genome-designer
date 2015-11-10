import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { partCreate } from '../actions/parts';
import { blockAddComponent } from '../actions/blocks';

import SketchBlock from '../components/SketchBlock';

/**
 @name SketchConstruct
 @description SketchConstruct is the parent element for drawing a construct.

 */

export default class SketchConstruct extends Component {
  static propTypes = {
    construct: PropTypes.object.isRequired,
    components: PropTypes.array.isRequired,

    blockCreate: PropTypes.func.isRequired,
    blockAddComponent: PropTypes.func.isRequired,
    partCreate: PropTypes.func.isRequired,
  };

  handleClickAddPart = (event) => {
    //todo - should support adding blocks, not just parts
    const { construct, partCreate, blockAddComponent } = this.props;
    const block = partCreate();
    blockAddComponent(construct.id, block.id);
  }

  render() {
    const { construct, components } = this.props;

    return (
      <div ref="constructContainer">
        <div ref="constructTitle"
             className="SketchPart">
          {construct.metadata.name}
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
             onClick={this.handleClickAddPart}>
          Add Part
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  //todo - should not know whether blocks / parts here. Need to handle nesting. Need to update schema with rules / options, and parts are options
  const components = props.construct.components.map(componentId => state.parts[componentId]);

  return {
    components,
  };
}

export default connect(mapStateToProps, {
  partCreate,
  blockAddComponent,
})(SketchConstruct);
