import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { part_create } from '../actions/parts';
import { block_addComponent } from '../actions/blocks';

import SketchBlock from '../components/SketchBlock';

/**
 @name SketchConstruct
 @description SketchConstruct is the parent element for drawing a construct.

 */

export default class SketchConstruct extends Component {

  static propTypes = {
    construct         : PropTypes.object.isRequired,
    components        : PropTypes.array.isRequired,
    block_create      : PropTypes.func.isRequired,
    block_addComponent: PropTypes.func.isRequired,
  };

  handleClickAddPart = (e) => {
    //todo - should support adding blocks, not just parts
    const { construct , part_create, block_addComponent } = this.props;
    let block = part_create();
    block_addComponent(construct.id, block.id);
  }

  render () {
    let { construct, components } = this.props;

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

function mapStateToProps (state, props) {
  //todo - should not know whether blocks / parts here. Need to handle nesting. Need to update schema with rules / options, and parts are options
  const components = props.construct.components.map(componentId => state.parts[componentId]);

  return {
    components,
  };
}

export default connect(mapStateToProps, {
  part_create,
  block_addComponent
})(SketchConstruct);