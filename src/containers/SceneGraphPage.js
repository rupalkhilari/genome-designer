import React, { Component } from 'react';
import { connect } from 'react-redux';
import SceneGraph2D from './graphics/scenegraph2d/scenegraph2d';
import UserInterface from './graphics/scenegraph2d/userinterface';

import '../styles/SceneGraphPage.css';

/**
 * just for testing bootstrap, hence the lack of comments
 */
class SceneGraphPage extends Component {

  constructor(props) {
    super(props);
    // create new scene graph
    this.sceneGraph = new SceneGraph2D({
      w: 975,
      h: 600,
      owner: this,
    });
    this.sceneGraph.props.userInterface = new UserInterface(this.sceneGraph, this.fakeDataSet());
  }

  componentDidMount = () => {
    this.refs.zoom.value = 1;
  }

  onZoom = () => {
    this.sceneGraph.setScale(parseFloat(this.refs.zoom.value));
    this.forceUpdate();
  }

  fakeATGC = (l = 4) => {
    const letters = ['A', 'T', 'G', 'C'];
    let s = '';
    for (let i = 0; i < l; i += 1) {
      s += letters[(Math.random() * 4) >> 0];
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
    const colors = ['EBBE9C', '#E89695', '#EAD993', '#96C78C', '#D0DFDE', '#79BFC1'];
    for (let i = 0; i < 25; i += 1) {
      d.parts.push({
        type: 'part',
        text: `Part ${i} ${this.fakeATGC(Math.random() * 6)}`,
        color: colors[Math.min(colors.length - 1, Math.round(Math.random() * colors.length))],
      });
      d.parts.push({
        type: 'connector',
        text: this.fakeATGC(),
      });
    }
    return d;
  }

  render() {
    return (
      <div>
        <input ref="zoom" type="range" min={0.1} max={4} step={0.1} onChange={this.onZoom}></input>
        <br></br>
        {this.sceneGraph.render()}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(SceneGraphPage);
