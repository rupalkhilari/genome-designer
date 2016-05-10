import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { projectList } from '../../actions/projects';
import { blockStash } from '../../actions/blocks';
import { infoQuery } from '../../middleware/api';

import InventoryProject from './InventoryProject';
import InventorySbolMap from './InventorySbolMap';
import InventoryTabs from './InventoryTabs';

export class InventoryGroupProjects extends Component {
  static propTypes = {
    projects: PropTypes.object.isRequired,
    projectId: PropTypes.string.isRequired,
    currentProject: PropTypes.string.isRequired,
    blockStash: PropTypes.func.isRequired,
    projectList: PropTypes.func.isRequired,
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
  };

  render() {
    const { projects, currentProject } = this.props;
    const { groupBy } = this.state;

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

    const currentList = groupBy === 'type' ?
      <InventorySbolMap /> :
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
})(InventoryGroupProjects);
