import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import ConstructViewer from './graphics/views/constructviewer';
import ConstructViewerCanvas from './graphics/views/constructViewerCanvas';
import ProjectDetail from '../components/ProjectDetail';
import ProjectHeader from '../components/ProjectHeader';
import Inventory from './Inventory';
import Inspector from './Inspector';
import { projectLoad } from '../actions/projects';
import { uiShowMainMenu } from '../actions/ui';

import '../styles/ProjectPage.css';
import '../styles/SceneGraphPage.css';

class ProjectPage extends Component {
  static propTypes = {
    project: PropTypes.object.isRequired,
    projectId: PropTypes.string.isRequired,
    constructs: PropTypes.array.isRequired,
    projectLoad: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    uiShowMainMenu: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.layoutAlgorithm = 'wrap';
  }

  onLayoutChanged = () => {
    this.layoutAlgorithm = this.refs.layoutSelector.value;
    this.forceUpdate();
  };


  render() {
    const { project, projectId, constructs } = this.props;

    if (!project || !project.metadata) {
      this.props.projectLoad(projectId)
        .catch(err => {
          //this.props.push('/');
        });
      return (<p>loading project...</p>);
    }
    // build a list of construct viewers
    const constructViewers = constructs.map(construct => {
      return (
        <ConstructViewer key={construct.id}
                         projectId={projectId}
                         constructId={construct.id}
                         layoutAlgorithm={this.layoutAlgorithm}/>
      );
    });

    return (
      <div className="ProjectPage">
        <Inventory projectId={projectId} />

        <div className="ProjectPage-content">

          <ProjectHeader project={project}/>

          <ConstructViewerCanvas
            currentProjectId={this.props.projectId}>
            {constructViewers}
          </ConstructViewerCanvas>

          <ProjectDetail project={project}/>
        </div>

        <Inspector projectId={projectId} />
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const projectId = ownProps.params.projectId;
  const project = state.projects[projectId];

  if (!project) {
    return {
      projectId,
    };
  }

  const constructs = project.components.map(componentId => state.blocks[componentId]);
  return {
    projectId,
    project,
    constructs,
  };
}

export default connect(mapStateToProps, {
  projectLoad,
  push,
  uiShowMainMenu,
})(ProjectPage);
