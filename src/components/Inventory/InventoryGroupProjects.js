import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { projectGet, projectListAllBlocks } from '../../selectors/projects';
import { projectList, projectLoad, projectSave, projectOpen } from '../../actions/projects';
import { focusForceProject } from '../../actions/focus';
import { blockStash } from '../../actions/blocks';
import { inspectorToggleVisibility } from '../../actions/inspector';
import { block as blockDragType } from '../../constants/DragTypes';
import { infoQuery } from '../../middleware/api';
import { symbolMap } from '../../inventory/sbol';

import InventoryListGroup from './InventoryListGroup';
import InventoryList from './InventoryList';
import InventoryTabs from './InventoryTabs';

const loadedProjects = {};

export class InventoryGroupProjects extends Component {
  static propTypes = {
    projects: PropTypes.object.isRequired,
    projectId: PropTypes.string.isRequired,
    currentProject: PropTypes.string.isRequired,
    blockStash: PropTypes.func.isRequired,
    projectList: PropTypes.func.isRequired,
    projectLoad: PropTypes.func.isRequired,
    projectGet: PropTypes.func.isRequired,
    projectSave: PropTypes.func.isRequired,
    projectListAllBlocks: PropTypes.func.isRequired,
    focusForceProject: PropTypes.func.isRequired,
    inspectorToggleVisibility: PropTypes.func.isRequired,
    projectOpen: PropTypes.func.isRequired,
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
      infoQuery('sbol').then(typeMap => this.setState({ typeMap }));
    }
  };

  //handle double-click to open
  onToggleProject = (nextState, projectId) => {
    const { currentProject } = this.props;

    this.handleToggleProject(nextState, projectId).then(() => {
      if (projectId === currentProject) {
        //inspect it
        this.inspectProject(projectId);
      } else {
        //save the previous one, open the new one
        this.props.projectSave()
          .then(() => this.openProject(projectId));
      }
    });
  };

  onToggleType = (nextState, type) => {
    if (!nextState) return;
    //no caching for now...

    infoQuery('sbol', type).then(blocks => this.setState({
      loadedTypes: Object.assign(this.state.loadedTypes, { [type]: blocks }),
    }));
  };

  onBlockDrop = (item, target) => {
    //if no components, dont need to worry about fetching them
    if (!item.components.length) {
      return Promise.resolve(item);
    }

    //get components if its a construct and add blocks to the store
    return infoQuery('components', item.id)
      .then(componentsObj => {
        const components = Object.keys(componentsObj).map(key => componentsObj[key]);
        return this.props.blockStash(...components);
      })
      .then(() => item);
  };

  openProject = (projectId) => {
    this.props.projectOpen(projectId);
  };

  inspectProject = (projectId) => {
    const project = this.props.projectGet(projectId);
    this.props.focusForceProject(project);
    this.props.inspectorToggleVisibility(true);
  };

  loadProject = (projectId) => {
    //todo - dont load blocks into store until the project is loaded (update selector)
    //we just want to load when the project is actually loaded. Dont add to store if we're going to just push it on with forceBlocks
    //however, need to make sure that blockClone will work. Perhaps we can add them to the store before the drag starts
    //todo - caching should be at API level, not in this component

    //todo - if we're just showing the blocks hierarchically, we can fetch components lazily using the middleware function to get components of a block. Or, since we're loading the whole project, we can just get them from the store as is.

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

  handleToggleProject = (nextState, projectId) => {
    return this.loadProject(projectId)
      .then(() => {
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
                                hideToggle={!project.components.length}
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
                         onDrop={this.onBlockDrop}
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
        <div className="InventoryGroup-contentInner no-vertical-scroll">
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
  blockStash,
  projectList,
  projectLoad,
  projectGet,
  projectSave,
  projectListAllBlocks,
  focusForceProject,
  inspectorToggleVisibility,
  projectOpen,
})(InventoryGroupProjects);
