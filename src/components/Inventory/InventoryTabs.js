import React, { Component, PropTypes } from 'react';

import '../../styles/InventoryTabs.css';

export default class InventoryTabs extends Component {
  static propTypes = {
    tabs: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
    })).isRequired,
    onTabSelect: PropTypes.func.isRequired,
    activeTabIndex: PropTypes.number,
    activeTabKey: PropTypes.string,
  };

  render() {
    const { tabs, onTabSelect, activeTabKey, activeTabIndex } = this.props;

    return (
      <div className="InventoryTabs">
        {tabs.map((tab, index) => {
          const isActive = activeTabKey === tab.key || activeTabIndex === index;
          return (
            <a className={'InventoryTabs-tab' + (isActive ? ' active' : '')}
               key={tab.name}
               onClick={() => onTabSelect(tab, index)}>
              {tab.name}
            </a>
          );
        })}
      </div>
    );
  }
}
