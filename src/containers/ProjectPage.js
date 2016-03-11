import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';
import ConstructViewer from './graphics/views/constructviewer';
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
    pushState: PropTypes.func.isRequired,
    uiShowMainMenu: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.layoutAlgorithm = 'wrap';
    this.props.uiShowMainMenu(true);
  }

  onLayoutChanged = () => {
    this.layoutAlgorithm = this.refs.layoutSelector.value;
    this.forceUpdate();
  };

  render() {
    const { project, projectId, constructs } = this.props;

    if (!project || !project.metadata) {
      this.props.projectLoad(projectId)
        .catch(err => this.props.pushState('/'));
      return <p>loading project...</p>;
    }

    const constructViewers = constructs.map(construct => {
      return (
        <ConstructViewer key={construct.id}
                         constructId={construct.id}
                         layoutAlgorithm={this.layoutAlgorithm}/>
      );
    });

    return (
      <div className="ProjectPage">
        <Inventory />

        <div className="ProjectPage-content">

          <ProjectHeader project={project}/>

          <div className="ProjectPage-constructs">
            {constructViewers}
          </div>

          <ProjectDetail project={project}/>
        </div>

        <Inspector />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { projectId } = state.router.params;
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
  pushState,
  uiShowMainMenu,
})(ProjectPage);
