import React, { PropTypes } from 'react';

import '../../styles/InventorySources.css';

export default function InventorySources({ toggling, sourceList, registry, onSourceToggle, onToggleVisible }) {
  const menu = (<div className="InventorySources-menu menu-popup-container">
    <div className="InventorySources-menu-heading menu-item disabled">Search Sources:</div>
    {Object.keys(registry)
      .filter(key => typeof registry[key].search === 'function')
      .map(key => {
        const source = registry[key];
        return (
          <div key={key}
               onClick={(evt) => {
                 evt.stopPropagation();
                 onSourceToggle(key);
               }}
               className={'InventorySources-menu-source menu-item'}>
            <div className={(sourceList.includes(key) ? 'menu-item-checked' : 'menu-item-unchecked')}></div>
            {source.name}
          </div>
        );
      })}
  </div>);

  return (
    <div className={'InventorySources' + (toggling ? ' expanded' : '')}
         onClick={() => onToggleVisible()}>
      <div className="InventorySources-back">
        <div className="InventorySources-back-cog"></div>
        <div className="InventorySources-back-sources">
          <span>{`Sources: ${sourceList.map(source => registry[source].name).join(', ')}`}</span>
        </div>
      </div>
      {toggling && menu}
    </div>
  );
}

InventorySources.propTypes = {
  toggling: PropTypes.bool.isRequired,
  registry: PropTypes.object.isRequired,
  sourceList: PropTypes.array.isRequired,
  onToggleVisible: PropTypes.func.isRequired,
  onSourceToggle: PropTypes.func.isRequired,
};
