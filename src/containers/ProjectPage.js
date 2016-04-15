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
import { focusProject } from '../actions/focus';

import '../styles/ProjectPage.css';
import '../styles/SceneGraphPage.css';

class ProjectPage extends Component {
  static propTypes = {
    projectId: PropTypes.string.isRequired,
    project: PropTypes.object, //if have a project (not fetching)
    constructs: PropTypes.array, //if have a project (not fetching)
    projectLoad: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    uiShowMainMenu: PropTypes.func.isRequired,
    focusProject: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.lastProjectId = null;
    this.layoutAlgorithm = 'wrap';
  }

  componentWillReceiveProps(nextProps) {
    //set state.focus.project -- might be a better way to do this, but hard otuside components with react-router
    if (!this.lastProjectId || nextProps.projectId !== this.props.projectId) {
      this.lastProjectId = nextProps.projectId;
      this.props.focusProject(nextProps.projectId);
    }
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
          this.props.push('/?noredirect=true');
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
        <Inventory projectId={projectId}/>

        <div className="ProjectPage-content">

          <ProjectHeader project={project}/>

          <ConstructViewerCanvas
            currentProjectId={this.props.projectId}>
            {constructViewers}
          </ConstructViewerCanvas>

          <ProjectDetail project={project}/>
        </div>

        <Inspector projectId={projectId}/>
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
  focusProject,
})(ProjectPage);
