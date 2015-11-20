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
      w: 975,
      h: 600,
      owner: this,
    });

    this.sceneGraph.props.userInterface = new UserInterface(this.sceneGraph, this.fakeDataSet());

  }

  onZoom = () => {
    this.sceneGraph.setScale(parseFloat(this.refs.zoom.value));
    this.forceUpdate();
  }

  fakeATGC = () => {
    const letters = ['A', 'T', 'G', 'C']
    let s = '';
    for(let i = 0; i < 4; i +=1) {
      s += letters[(Math.random() * 4)>>0];
    }
    return s;
  }

  /*
   * build some fake data to test SVG rendering
   */
  fakeDataSet = () => {

    const d = {
      name: 'Bacterial ORI-AMPR #4',
      parts: [],
    };
    const colors = ['#DBE8C7','#8DA5D2','#FEE798','#E8D1E4','#FEE3BA'];
    for(let i = 0; i < 50; i += 1) {
      d.parts.push({
        type: 'part',
        text: `Part ${i}`,
        color: colors[Math.min(colors.length-1, Math.round(Math.random() * colors.length))]
      });
      d.parts.push({
        type: 'connector',
        text: this.fakeATGC(),
      });
    }
    return d;
  }


  render () {
    return (
      <div>
        {this.sceneGraph.render()}
        <br></br>
        <input ref="zoom" type="range" min={0.1} max={4} step={0.1} onChange={this.onZoom}></input>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(SceneGraphPage);
