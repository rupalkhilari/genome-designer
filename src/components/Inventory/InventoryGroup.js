import React, { Component, PropTypes } from 'react';

import InventoryGroupSbol from './InventoryGroupSbol';
import InventoryGroupBlocks from './InventoryGroupBlocks';
import InventoryGroupSearch from './InventoryGroupSearch';
import InventoryGroupProjects from './InventoryGroupProjects';

import '../../styles/InventoryGroup.css';

export default class InventoryGroup extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    isActive: PropTypes.bool.isRequired,
    setActive: PropTypes.func.isRequired,
  };

  inventoryGroupTypeToComponent = (type, props) => {
    switch (type) {
    case 'sbol' :
      return (<InventoryGroupSbol {...props} />);
    case 'search' :
      return (<InventoryGroupSearch {...props} />);
    case 'projects':
      return (<InventoryGroupProjects {...props} />);
    case 'block':
      return (<InventoryGroupBlocks {...props} />); //deprecated
    default:
      throw new Error(`Type ${type} is not registered in InventoryGroup`);
    }
  };

  render() {
    const { title, type, isActive, setActive, ...rest } = this.props;
    const currentGroupComponent = this.inventoryGroupTypeToComponent(type, rest);

    return (
      <div className={'InventoryGroup' + (isActive ? ' active' : '')}>
        <div className="InventoryGroup-heading"
             onClick={setActive}>
          <span className="InventoryGroup-title">{title}</span>
        </div>
        {isActive && currentGroupComponent}
      </div>
    );
  }
}
