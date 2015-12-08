import React, { Component, PropTypes } from 'react';
import Vector2D from '../geometry/vector2d.js';
import Box2D from '../geometry/box2d.js';
import SceneGraph2D from '../scenegraph2d/scenegraph2d';
import Node2D from '../scenegraph2d/node2d';
import Layout from './layout.js';

export default class ConstructViewer extends Component {

  static propTypes = {

  }

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // we will need a reference to our actual DOM node
    const dom = React.findDOMNode(this);
    // create the scene graph we are going to use to display the construct
    this.sg = new SceneGraph2D({
      width: dom.clientWidth,
      height: dom.clientHeight,
      parent: dom,
    });
    // create the layout object
    this.layout = new Layout(this, this.sg, this.props.construct, {
      width: dom.clientWidth,
    });
    // perform initial Layout
    this.layout.update();
  }

  /**
   * update scene graph after the react component updates`
   */
  componentDidUpdate() {
    this.sg.update();
  }
  /**
   * render the component, the scene graph will render later when componentDidUpdate is called
   */
  render() {
    return(<div className="construct-viewer" key={this.props.construct.id}/>)
  }
}
