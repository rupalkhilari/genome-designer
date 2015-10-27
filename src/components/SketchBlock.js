import React, { Component, PropTypes } from 'react';
import * as SchemaTypes from '../schemas/validators';
import SketchPart from './SketchPart';

export default class SketchBlock extends Component {
  constructor (props) {
    super(props);
  }

  static PropTypes = {
    block: PropTypes.object.isRequired //once using real ones, can pass schema as PropType
  }

  render () {

    const {block} = this.props;

    console.log(block);

    let children = isPart(block) ?
                   <SketchPart part={block}/> :
                   block.components.map(comp => {
                     return (<SketchBlock block={comp}/>)
                   });

    return (
      <g ref="blockGroup">
        {children}
      </g>
    );
  }
}

function isPart (component) {
  console.log(component);
  return component && (!component.components || component.components.length === 1);
}