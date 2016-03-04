import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';
import { listProjects } from '../../middleware/api';
import { projectGet, projectListAllBlocks } from '../../selectors/projects';
import { projectLoad } from '../../actions/projects';
import { block as blockDragType } from '../../constants/DragTypes';

import InventoryListGroup from './InventoryListGroup';
import InventoryList from './InventoryList';

const loadedProjects = {};

export class InventoryGroupProjects extends Component {
  static propTypes = {
    currentProject: PropTypes.string.isRequired,
    projectLoad: PropTypes.func.isRequired,
    projectGet: PropTypes.func.isRequired,
    projectListAllBlocks: PropTypes.func.isRequired,
    pushState: PropTypes.func.isRequired,
  };

  constructor() {
    super();
    this.clicks = 0;
  }

  state = {
    recentProjects: [],
    expandedProjects: {},
  };

  componentDidMount() {
    listProjects().then(projects => this.setState({ recentProjects: projects }));
  }

  handleLoadProject = (projectId) => {
    //todo - dont load blocks into store until the project is loaded (update selector)
    //todo - caching should be at API level, not in this component

    return !!loadedProjects[projectId]
      ?
      Promise.resolve(loadedProjects[projectId])
      :
      this.props.projectLoad(projectId)
        .then((project) => this.props.projectListAllBlocks(projectId))
        .then(blocks => {
          Object.assign(loadedProjects, { [projectId]: blocks });
          return loadedProjects[projectId];
        });
  };

  handleOpenProject = (nextState, projectId) => {
    this.props.projectLoad(projectId)
      .then(() => this.props.pushState(null, `/project/${projectId}`));
  };

  handleToggleProject = (nextState, projectId) => {
    this.handleLoadProject(projectId)
      .then(() => this.setState({
        expandedProjects: Object.assign(this.state.expandedProjects, { [projectId]: nextState }),
      }));
  };

  handleOnToggle = (nextState, projectId) => {
    //handle double-click to open
    this.clicks++;
    if (this.clicks === 1) {
      //todo - handle this promise better - don't want to request more than once
      const promise = this.handleLoadProject(projectId);
      window.setTimeout(() => {
        if (this.clicks === 1) {
          promise.then(() => this.handleToggleProject(nextState, projectId));
        } else {
          promise.then(() => this.handleOpenProject(nextState, projectId));
        }
        this.clicks = 0;
      }, 300);
    }
  };

  render() {
    const { currentProject } = this.props;
    const { recentProjects, expandedProjects } = this.state;

    const projectList =
      (!recentProjects.length)
        ?
        (<p>no projects</p>)
        :
        recentProjects.map(project => {
          const isActive = (project.id === currentProject);
          const isExpanded = expandedProjects[project.id];
          return (
            <InventoryListGroup key={project.id}
                                title={project.metadata.name || 'My Project'}
                                manual
                                isExpanded={isExpanded}
                                onToggle={(nextState) => this.handleOnToggle(nextState, project.id)}
                                isActive={isActive}>
              <InventoryList inventoryType={blockDragType}
                             items={loadedProjects[project.id]}/>
            </InventoryListGroup>
          );
        });

    return (
      <div className="InventoryGroup-content InventoryGroupProjects">
        {projectList}
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  const { projectId } = state.router.params;

  return {
    currentProject: projectId,
  };
}

export default connect(mapStateToProps, {
  projectLoad,
  projectGet,
  projectListAllBlocks,
  pushState,
})(InventoryGroupProjects);
