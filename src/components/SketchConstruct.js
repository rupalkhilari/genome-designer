import React, { Component, PropTypes } from 'react';
import * as SchemaTypes from '../schemas/validators';

import SketchBlock from './SketchBlock';

/**
 @name SketchConstruct
 @description SketchConstruct is the parent element for drawing a construct.

 */

export default class SketchConstruct extends Component {

  static propTypes = {
    construct: PropTypes.object.isRequired
  };

  render () {
    let { construct } = this.props,
        components = construct.components;

    return (
      <div ref="constructContainer">
        <div ref="constructComponents">
          {components.map(comp =>
            <SketchBlock key={comp.id}
                         block={comp}/>
          )}
        </div>
      </div>
    );
  }
}