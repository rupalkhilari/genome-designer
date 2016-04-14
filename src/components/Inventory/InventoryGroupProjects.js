import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { projectGet, projectListAllBlocks } from '../../selectors/projects';
import { projectList, projectLoad } from '../../actions/projects';
import { focusForceProject } from '../../actions/focus';
import { block as blockDragType } from '../../constants/DragTypes';

import InventoryListGroup from './InventoryListGroup';
import InventoryList from './InventoryList';
import InventoryTabs from './InventoryTabs';

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
    focusForceProject: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
  };

  constructor() {
    super();
    this.clicks = 0;

    this.inventoryTabs = [
      { key: 'source', name: 'By Project' },
      { key: 'type', name: 'By Type' },
    ];
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
    //we just want to load when the project is actually loaded. Dont add to store if we're going to just push it on with forceBlocks
    //however, need to make sure that blockClone will work. Perhaps we can add them to the store before the drag starts
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
      .then(() => this.props.push(`/project/${projectId}`));
  };

  handleToggleProject = (nextState, projectId) => {
    this.handleLoadProject(projectId)
      .then(() => {
        const project = this.props.projectGet(projectId);
        this.props.focusForceProject(project);
        this.setState({
          expandedProjects: Object.assign(this.state.expandedProjects, { [projectId]: nextState }),
        });
      });
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

  handleTabSelect = (key) => {
    this.setState({ groupBy: key });
  };

  render() {
    const { projects, currentProject } = this.props;
    const { expandedProjects, groupBy } = this.state;

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
    
    const byTypeList = (this.loaded)

    return (
      <div className="InventoryGroup-content InventoryGroupProjects">
        <InventoryTabs tabs={this.inventoryTabs}
                       activeTabKey={groupBy}
                       onTabSelect={(tab) => this.handleTabSelect(tab.key)}/>
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
  focusForceProject,
  push,
})(InventoryGroupProjects);
