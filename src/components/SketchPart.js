import React, { Component, PropTypes } from 'react';
import * as SchemaTypes from '../schemas/validators';

export default class SketchBlock extends Component {
  constructor(props) {
    super(props);
  }

  static PropTypes = {
    component : PropTypes.object.isRequired //once using real ones, can pass schema as PropType
  }

  render() {

    let comp = this.props.component;

    return (
      <g ref="partGroup">
    	  <rect color={comp.color} />
    	</g>
    );
  }
}

function isPart (component) {
  return ! component.components;
}