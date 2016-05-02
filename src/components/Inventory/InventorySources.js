import React, { Component, PropTypes } from 'react';

import '../../styles/InventorySources.css';

export default class InventorySources extends Component {
  static propTypes = {
    registry: PropTypes.object.isRequired,
    sourceList: PropTypes.array.isRequired,
    onSourceToggle: PropTypes.func.isRequired,
  };

  state = {
    expanded: false,
  };

  toggleExpanded = (forceState) => {
    this.setState({
      expanded: (forceState === true || forceState === false) ? forceState : !this.state.expanded,
    });
  };

  render() {
    const { sourceList, registry, onSourceToggle } = this.props;
    const { expanded } = this.state;

    const content = !expanded
      ?
      <span>{`${sourceList.map(source => registry[source].name).join(', ')}`}</span>
      :
      <div>
        {Object.keys(registry).map(key => {
          const source = registry[key];
          return (
            <div key={key}
                 onClick={(evt) => {
                 evt.stopPropagation();
                   onSourceToggle(key);
                 }}
                 className="InventorySources-source">
              <input type="checkbox"
                     className="InventorySources-toggler"
                     readOnly
                     checked={sourceList.includes(key)}/>{source.name}</div>
          );
        })}
      </div>;

    return (
      <div className={'InventorySources' + (expanded ? ' expanded' : '')} onClick={this.toggleExpanded}>
        <div className="InventorySources-cog"></div>
        <div className="InventorySources-sources">
          <span>Sources: </span>
          {content}
        </div>
      </div>
    );
  }
}
