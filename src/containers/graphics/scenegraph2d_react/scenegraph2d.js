import invariant from '../../../utils/environment/invariant';
import React, { Component, PropTypes } from 'react';
import Vector2D from '../geometry/vector2d.js';

export default class SceneGraph2D extends React.Component {



  render() {

    const style = {
      width: this.props.w + 'px',
      height: this.props.h + 'px',
    }

    return (
      <div style={style} ref="sceneGraph" className="sceneGraph" onScroll={this.onScroll} >
        {this.props.children}
      </div>
    );
  }

  /**
   * scene graph has overflow:auto so that as it is scaled it will allow the user
   * to pan around to view the entire scene. Any user interface would need to
   * know the current scroll position so it can factored into things like
   * mouse coordinate positions.
   * @param  {[type]} e [description]
   * @return {[type]}   [description]
   */
  onScroll = (e) => {
    const scrollVector = new Vector2D(this.refs.sceneGraph.scrollLeft, this.refs.sceneGraph.scrollTop);
    this.props.onScrolled(scrollVector);
  }
}
