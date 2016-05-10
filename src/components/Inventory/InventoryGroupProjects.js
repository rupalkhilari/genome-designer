import React, { Component, PropTypes } from 'react';

import InventoryProjectList from './InventoryProjectList';
import InventorySbolMap from './InventorySbolMap';
import InventoryTabs from './InventoryTabs';

export default class InventoryGroupProjects extends Component {
  static propTypes = {
    currentProject: PropTypes.string.isRequired,
  };

  state = {
    groupBy: 'project',
  };

  inventoryTabs = [
    { key: 'project', name: 'By Project' },
    { key: 'type', name: 'By Kind' },
  ];

  onTabSelect = (key) => {
    this.setState({ groupBy: key });
  };

  render() {
    const { currentProject } = this.props;
    const { groupBy } = this.state;

    const currentList = groupBy === 'type'
      ?
      <InventorySbolMap />
      :
      <InventoryProjectList currentProject={currentProject}/>;

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
