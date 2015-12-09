import React, { Component, PropTypes } from 'react';
import Vector2D from '../geometry/vector2d.js';

export default class SceneGraph2D extends Component {

  static propTypes = {
    w: PropTypes.number.isRequired,
    h: PropTypes.number.isRequired,
    scale: PropTypes.number.isRequired,
    uuid: PropTypes.string.isRequired,
    children: PropTypes.object.isRequired,
    onScrolled: PropTypes.func.isRequired,
    scrollOffset: PropTypes.object.isRequired,
    ui: PropTypes.object,
  }

  componentDidUpdate() {
    const dom = React.findDOMNode(this);
    dom.scrollLeft = this.props.scrollOffset.x;
    dom.scrollTop = this.props.scrollOffset.y;
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
    const scrollVector = new Vector2D(this.refs.sceneGraphContainer.scrollLeft, this.refs.sceneGraphContainer.scrollTop);
    this.props.onScrolled(scrollVector);
  }

  /**
   * return entire scenegraph including children
   * @return {[type]} [description]
   */
  render() {
    // container style
    const cstyle = {
      width: this.props.w + 'px',
      height: this.props.h + 'px',
    };
    // width and height of the scenegraph should match our size * view scale
    const style = {
      width: (this.props.w * this.props.scale) + 'px',
      height: (this.props.h * this.props.scale) + 'px',
    };

    return (
      <div className="sceneGraphContainer" style={cstyle} ref="sceneGraphContainer" onScroll={this.onScroll}>
        <div style={style} key={this.props.uuid} ref="sceneGraph" className="sceneGraph">
          {this.props.children}
        </div>
        {this.props.ui}
      </div>
    );
  }
}
