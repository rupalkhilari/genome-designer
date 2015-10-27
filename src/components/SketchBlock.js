import React, { Component, PropTypes } from 'react';
import * as SchemaTypes from '../schemas/validators';

import SketchPart from './SketchPart';

export default class SketchBlock extends Component {

  static PropTypes = {
    block: PropTypes.object.isRequired //once using real ones, can pass schema as PropType
  }

  render () {
    const {block} = this.props;

    return isPart(block)
      ?
           <SketchPart key={block.id}
                       part={block}/>
      :
           <div ref="blockGroup">
             {block.components.map(comp => {
               return (<SketchBlock key={comp.id}
                                    block={comp}/>)
             })}
           </div>;
  }
}

function isPart (component) {
  return component && (!component.components || component.components.length === 1);
}