import React, { Component, PropTypes } from 'react';
import * as SchemaTypes from '../schemas/validators';

export default class SketchPart extends Component {
  constructor (props) {
    super(props);
  }

  static PropTypes = {
    part: PropTypes.object.isRequired //once using real ones, can pass schema as PropType
  }

  render () {

    let {part} = this.props;

    return (
      <g ref="partGroup">
        <rect color={part.color}/>
      </g>
    );
  }
}