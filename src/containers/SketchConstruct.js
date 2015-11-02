import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import SketchBlock from './../components/SketchBlock';

/**
 @name SketchConstruct
 @description SketchConstruct is the parent element for drawing a construct.

 */

export default class SketchConstruct extends Component {

  static propTypes = {
    construct: PropTypes.object.isRequired,
    components: PropTypes.array.isRequired
  };

  render () {
    let { construct, components } = this.props;

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

function mapStateToProps (state, props) {
  //todo - should not know whether blocks / parts here. Need to handle nesting. Need to update schema with rules / options, and parts are options
  const components = props.construct.components.map(componentId => state.parts[componentId]);

  return {
    components
  };
}

export default connect(mapStateToProps, {})(SketchConstruct);