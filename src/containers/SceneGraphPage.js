import React, {
  Component,
  PropTypes
} from 'react';
import {
  Link
} from 'react-router';
import {
  connect
} from 'react-redux';
import styles from '../styles/SceneGraphPage.css';
import withStyles from '../decorators/withStyles';
import SceneGraph2D from './graphics/scenegraph2d/scenegraph2d';
import Node2D from './graphics/scenegraph2d/node2d';
import UserInterface from './graphics/scenegraph2d/userinterface';


/**
 * just for testing bootstrap, hence the lack of comments
 */
@withStyles(styles)
class SceneGraphPage extends Component {

  constructor (props) {
    super(props);

    // create new scene graph
    this.sceneGraph = new SceneGraph2D({
      w: 1000,
      h: 800,
      owner: this,
    });
    this.sceneGraph.props.userInterface = new UserInterface(this.sceneGraph);

    this.sceneGraph.root.appendChild(new Node2D({
      x: 200,
      y: 300,
      w: 200,
      h: 100,
      r: 22.5,
      glyph: 'rectangle',
      text: 'parent'
    })).appendChild(new Node2D({
      x: 200,
      y: 100,
      w: 200,
      h: 100,
      r: 22.5,
      fill: 'red',
      glyph: 'rectangle',
      text: 'child',
    }));

    this.sceneGraph.root.appendChild(new Node2D({
      x: 400,
      y: 100,
      w: 200,
      h: 100,
      fill: 'green',
      glyph: 'ellipse',
      text: 'sibling'
    }))
  }

  onZoom = () => {
    this.sceneGraph.root.set({
      scale: parseFloat(this.refs.zoom.value)
    });
    this.forceUpdate();
  }

  onTraverse = () => {
    console.log('traversal');
    this.sceneGraph.traverse( node => {
      console.log(node.props.text);
    });
  }

  render () {
    return (
      <div>
        {this.sceneGraph.render()}
        <br></br>
        <input ref="zoom" type="range" min={0.1} max={4} step={0.1} onChange={this.onZoom}></input>
        <br></br>
        <button onClick={this.onTraverse}>Traverse</button>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(SceneGraphPage);
