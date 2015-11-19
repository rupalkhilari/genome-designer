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

    for(let y = 0; y < 8; y += 1) {
      for(let x = 0; x < 8; x += 1) {
        this.sceneGraph.root.appendChild(new Node2D({
          x: 50 + x * 100,
          y: 50 + y * 100,
          w: 80,
          h: 60,
          fill: 'red',
          r: Math.random() * 360,
          glyph: 'rectangle'
        })).appendChild(new Node2D({
          x: 50,
          y: 50,
          w: 60,
          h: 40,
          fill: 'green',
          r: Math.random() * 360,
          glyph: 'rectangle'
        })).appendChild(new Node2D({
          x: 50,
          y: 50,
          w: 60,
          h: 40,
          fill: 'blue',
          r: Math.random() * 360,
          glyph: 'ellipse',
          text: (x + y * 8).toString()
        }));
      }
    }

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
