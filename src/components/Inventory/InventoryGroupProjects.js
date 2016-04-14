import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { projectGet, projectListAllBlocks } from '../../selectors/projects';
import { projectList, projectLoad } from '../../actions/projects';
import { focusForceProject } from '../../actions/focus';
import { block as blockDragType } from '../../constants/DragTypes';
import { getProjectsInfo } from '../../middleware/api';
import { symbolMap } from '../../inventory/sbol';

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
      { key: 'project', name: 'By Project' },
      { key: 'type', name: 'By Kind' },
    ];
  }

  state = {
    expandedProjects: {},
    loadedTypes: {},
    groupBy: 'project',
    typeMap: {},
  };

  componentDidMount() {
    //retrigger on each load?
    this.props.projectList();
  }

  onTabSelect = (key) => {
    this.setState({ groupBy: key });

    if (key === 'type') {
      getProjectsInfo('sbol').then(typeMap => this.setState({ typeMap }));
    }
  };

  //handle double-click to open
  onToggleProject = (nextState, projectId) => {
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

  onToggleType = (nextState, type) => {
    if (!nextState) return;
    //no caching for now...

    getProjectsInfo('sbol', type).then(blocks => this.setState({
      loadedTypes: Object.assign(this.state.loadedTypes, { [type]: blocks }),
    }));
  };

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

  render() {
    const { projects, currentProject } = this.props;
    const { expandedProjects, loadedTypes, groupBy, typeMap } = this.state;

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
                                onToggle={(nextState) => this.onToggleProject(nextState, projectId)}
                                isActive={isActive}>
              <InventoryList inventoryType={blockDragType}
                             items={loadedProjects[projectId]}/>
            </InventoryListGroup>
          );
        });

    const byKindList = Object.keys(typeMap).map(type => {
      const count = typeMap[type];
      const name = symbolMap[type] || type;
      const items = loadedTypes[type] || [];
      return (
        <InventoryListGroup key={type}
                            title={name + ` (${count})`}
                            onToggle={(nextState) => this.onToggleType(nextState, type)}>
          <InventoryList inventoryType={blockDragType}
                         items={items}/>
        </InventoryListGroup>
      );
    });

    const currentList = groupBy === 'type' ?
      byKindList :
      projectList;

    return (
      <div className="InventoryGroup-content InventoryGroupProjects">
        <InventoryTabs tabs={this.inventoryTabs}
                       activeTabKey={groupBy}
                       onTabSelect={(tab) => this.onTabSelect(tab.key)}/>
        <div className="InventoryGroup-contentInner">
          {currentList}
        </div>
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
