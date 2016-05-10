import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { projectList } from '../../actions/projects';
import { blockStash } from '../../actions/blocks';
import { inspectorToggleVisibility } from '../../actions/ui';
import { block as blockDragType } from '../../constants/DragTypes';
import { infoQuery } from '../../middleware/api';
import { symbolMap } from '../../inventory/sbol';

import InventoryProject from './InventoryProject';
import InventoryListGroup from './InventoryListGroup';
import InventoryList from './InventoryList';
import InventoryTabs from './InventoryTabs';

export class InventoryGroupProjects extends Component {
  static propTypes = {
    projects: PropTypes.object.isRequired,
    projectId: PropTypes.string.isRequired,
    currentProject: PropTypes.string.isRequired,
    blockStash: PropTypes.func.isRequired,
    projectList: PropTypes.func.isRequired,
    focusForceProject: PropTypes.func.isRequired,
    inspectorToggleVisibility: PropTypes.func.isRequired,
  };

  state = {
    loadedTypes: {},
    groupBy: 'project',
    typeMap: {},
  };

  inventoryTabs = [
    { key: 'project', name: 'By Project' },
    { key: 'type', name: 'By Kind' },
  ];

  componentDidMount() {
    //retrigger on each load?
    this.props.projectList();
  }

  onTabSelect = (key) => {
    this.setState({ groupBy: key });

    if (key === 'type') {
      //returns a map { <sbolkey> : number }
      infoQuery('sbol').then(typeMap => this.setState({ typeMap }));
    }
  };

  onToggleType = (nextState, type) => {
    if (!nextState) return;
    //no caching for now...
    //when update to a cache, this should live update (right now, updates only when change tabs)

    //returns an array of blocks
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
    //note - this may be a very large query
    return infoQuery('components', item.id)
      .then(componentsObj => {
        //this object is a map of { <blockId> : <block> }, including the item itself
        const components = Object.keys(componentsObj).map(key => componentsObj[key]);
        return this.props.blockStash(...components);
      })
      .then(() => item);
  };

  render() {
    const { projects, currentProject } = this.props;
    const { loadedTypes, groupBy, typeMap } = this.state;

    const projectList =
      (!Object.keys(projects).length)
        ?
        (<p>no projects</p>)
        :
        Object.keys(projects).map(projectId => {
          const project = projects[projectId];
          const isActive = (projectId === currentProject);

          return (
            <InventoryProject key={projectId}
                              project={project}
                              isActive={isActive}/>
          );
        });

    //todo - this should be broken into its own component and handle specific cases (e.g. loading) inside of it
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
  inspectorToggleVisibility,
})(InventoryGroupProjects);
