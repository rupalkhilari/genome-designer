import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
import SceneGraph2D from './graphics/scenegraph2d/scenegraph2d';
import ConstructViewer from './graphics/views/constructviewer';
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

  render() {
    const { children, constructId, project, constructs } = this.props;

    const constructViewers = constructs.map(construct => {
      return <ConstructViewer key={construct.id} construct={construct}/>
    });
    return (
      <div className="ProjectPage">
        <Inventory />
        <div className="ProjectPage-content">
          <div style={{width: "400px"}}>
            <input ref="zoom" type="range" min={0.1} max={4} step={0.1} onChange={this.onZoom}></input>
            <br></br>
            <select ref="layoutSelect" defaultValue="wrap" onChange={this.layoutChanged}>
              <option value={K.layoutWrap}>Wrap</option>
              <option value={K.layoutWrapCondensed}>Wrap / Condensed</option>
              <option value={K.layoutFull}>Full</option>
              <option value={K.layoutFullCondensed}>Full / Condensed</option>
            </select>
          </div>
          <br></br>
          {constructViewers}
        </div>
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
