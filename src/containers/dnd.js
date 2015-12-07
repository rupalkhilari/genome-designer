import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
import SceneGraph2D from './graphics/scenegraph2d/scenegraph2d';
import BlockTest from './graphics/scenegraph2d_react/blocktest';
import UserInterface from './graphics/scenegraph2d/userinterface';
import K from './graphics/scenegraph2d/blocky/blockyconstants';
import Inventory from './Inventory';
import '../styles/SceneGraphPage.css';
import uuid from 'node-uuid';
import randomColor from '../utils/generators/color';

/**
 * just for testing bootstrap, hence the lack of comments
 */
@DragDropContext(HTML5Backend)
class DnD extends Component {

  static propTypes = {
    project: PropTypes.object.isRequired,
    projectId: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    this.bd = [];
    for(var i = 0; i < 100; i += 1) {
      this.makeBlock();
    }
    window.requestAnimationFrame(this.animate);
  }

  makeBlock() {
    this.bd.push({
      x: Math.random() * 1024,
      y: Math.random() * 768,
      w: Math.max(10, Math.random() * 100),
      h: Math.max(10, Math.random() * 40),
      c: randomColor(),
      r: Math.random() * 360,
    });
  }

  add100 = () => {
    for(let i = 0; i < 100; i +=1) {
      this.makeBlock();
    }
    this.refs.blocktest.forceUpdate();
  }

  animate = () => {
    if (this.refs.blocktest) {
      this.bd.forEach(block => {
        block.x += 1;
        if (block.x > 1024) {
          block.x = -block.w;
        }
        block.r = (block.r + 1) % 360;
      });
      this.refs.blocktest.forceUpdate();
    }
    window.requestAnimationFrame(this.animate);
  }

  componentDidMount = () => {
    this.refs.zoom.value = 1;
  }

  /**
   * when the user changes the zoom/scaling
   * @return {[type]} [description]
   */
  onZoom = () => {
    // this.projects.forEach(project => {
    //   project.sceneGraph.setScale(parseFloat(this.refs.zoom.value));
    // });
    // this.forceUpdate();
  }
  /**
   * when the user changes the layout algorithm
   */
  layoutChanged = () => {
    // this.projects.forEach(project => {
    //   const ui = project.sceneGraph.props.userInterface;
    //   ui.layoutAlgorithm(this.refs.layoutSelect.value);
    // });
  }

  construct2sceneGraph(construct) {
    const sg = new SceneGraph2D({
      w: 975,
      h: 300,
      owner: this,
    });
    sg.props.userInterface = new UserInterface(sg, construct);
    return sg;
  }

  render() {
    const { children, constructId, project, constructs } = this.props;
    debugger;
    // map all constructs to scene graphs and render them
    const renderedSceneGraphs = constructs.map(construct => {
      const sceneGraph = this.construct2sceneGraph(construct);
      return sceneGraph.render();
    });

    return (
      <div>
        <Inventory />
        <input ref="zoom" type="range" min={0.1} max={4} step={0.1} onChange={this.onZoom}></input>
        <br></br>
        <select ref="layoutSelect" defaultValue="wrap" onChange={this.layoutChanged}>
          <option value={K.layoutWrap}>Wrap</option>
          <option value={K.layoutWrapCondensed}>Wrap / Condensed</option>
          <option value={K.layoutFull}>Full</option>
          <option value={K.layoutFullCondensed}>Full / Condensed</option>
        </select>
        <br></br>
        {renderedSceneGraphs}
        <BlockTest ref="blocktest" blocks={this.bd}/>
        <button onClick={this.add100}>Add One Hundred</button>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { projectId, constructId } = state.router.params;
  const project = state.projects[projectId];
  const constructs = project.components.map(componentId => state.blocks[componentId]);

  return {
    projectId,
    constructId,
    project,
    constructs,
  };
}

export default connect(mapStateToProps, {
  pushState,
})(DnD);
