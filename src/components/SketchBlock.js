import React, { Component, PropTypes } from 'react';
import * as SchemaTypes from '../schemas/validators';

export default class SketchPart extends Component {
  constructor(props) {
    super(props);
  }

  static PropTypes = {
    component : PropTypes.object.isRequired //once using real ones, can pass schema as PropType
  }

  render() {
    return (
      <g ref="blockGroup">
    	  {
    	  	//todo - check if block vs. part and render accordingly
    	  	return this.props.components.map(comp => {
            if (isPart(comp)) {
              return <SketchPart component={component} />
            } else {
              return <SketchBlock component={component} />  
            }
    	  	});
    	  }
    	</g>
    );
  }
}

function isPart (component) {
  return ! component.components;
}