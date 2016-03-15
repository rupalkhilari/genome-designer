import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { projectGet, projectListAllBlocks } from '../../selectors/projects';
import { projectList, projectLoad } from '../../actions/projects';
import { block as blockDragType } from '../../constants/DragTypes';

import InventoryListGroup from './InventoryListGroup';
import InventoryList from './InventoryList';

//temp - non-empty to handle test project
const loadedProjects = {
  test: [],
};

export class InventoryGroupProjects extends Component {
  static propTypes = {
    projects: PropTypes.object.isRequired,
    projectId: PropTypes.string.isRequired,
    currentProject: PropTypes.string.isRequired,
    projectList: PropTypes.func.isRequired,
    projectLoad: PropTypes.func.isRequired,
    projectGet: PropTypes.func.isRequired,
    projectListAllBlocks: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
  };

  constructor() {
    super();
    this.clicks = 0;
  }

  state = {
    expandedProjects: {},
  };

  componentDidMount() {
    //retrigger on each load?
    this.props.projectList();
  }

  handleLoadProject = (projectId) => {
    //temporary - handle test project scenario
    if (projectId === 'test') {
      return Promise.resolve();
    }

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
    this.handleLoadProject(projectId)
      .then(() => this.props.push(null, `/project/${projectId}`));
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
    const { projects, currentProject } = this.props;
    const { expandedProjects } = this.state;

    const projectList =
      (!Object.keys(projects).length)
        ?
        (<p>no projects</p>)
        :
        Object.keys(projects).map(projectId => {
          const project = projects[projectId];
          const isActive = (projectId === currentProject);
          const isExpanded = expandedProjects[projectId];
          return (
            <InventoryListGroup key={projectId}
                                title={project.metadata.name || 'Untitled Project'}
                                manual
                                isExpanded={isExpanded}
                                onToggle={(nextState) => this.handleOnToggle(nextState, projectId)}
                                isActive={isActive}>
              <InventoryList inventoryType={blockDragType}
                             items={loadedProjects[projectId]}/>
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
  const { projectId } = props;
  const { projects } = state;

  return {
    projects,
    currentProject: projectId,
  };
}

export default connect(mapStateToProps, {
  projectList,
  projectLoad,
  projectGet,
  projectListAllBlocks,
  push,
})(InventoryGroupProjects);
