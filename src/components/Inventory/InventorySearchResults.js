/*
 Copyright 2016 Autodesk,Inc.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */
import React, { Component, PropTypes } from 'react';

import { block as blockDragType } from '../../constants/DragTypes';
import { chain } from 'lodash';

import { registry } from '../../inventory/registry';

import Spinner from '../../components/ui/Spinner';
import InventoryTabs from './InventoryTabs';
import InventoryList from './InventoryList';
import InventoryListGroup from './InventoryListGroup';

const inventoryTabs = [
  { key: 'source', name: 'By Source' },
  { key: 'type', name: 'By Kind' },
];

export default class InventorySearchResults extends Component {
  static propTypes = {
    searchTerm: PropTypes.string.isRequired,
    sourcesToggling: PropTypes.bool.isRequired,
    searching: PropTypes.bool.isRequired,
    sourceList: PropTypes.array.isRequired,
    searchResults: PropTypes.object.isRequired,
    sourcesVisible: PropTypes.object.isRequired,
    inventoryToggleSourceVisible: PropTypes.func.isRequired,
    blockStash: PropTypes.func.isRequired,
  };

  state = {
    groupBy: 'source',
  };

  onListGroupToggle = (source) => {
    this.props.inventoryToggleSourceVisible(source);
  };

  getFullItem = (registryKey, item, onlyConstruct = false, shouldAddToStore = true) => {
    const { source, id } = item.source;
    const parameters = {
      onlyConstruct,
    };

    if (source && id) {
      return registry[source].get(id, parameters, item)
        .then(result => {
          //if we have an array, first one is construct, and all other blocks should be added to the store
          if (Array.isArray(result)) {
            const [ construct, ...blocks ] = result;

            //need to specially handle blocks which are constructs here, add them to the store (not important for showing in the inspector)
            //todo - performance -- this will effectively add everything twice, since will be cloned. Should not clone deep (there is an option for this in blockClone, need to pass to onDrop of construct viewer, somehow diffrentiate from dragging a construct from a project
            if (shouldAddToStore) {
              this.props.blockStash(construct, ...blocks);
            }

            return construct;
          }
          //otherwise, just one result
          return result;
        });
    }
    return Promise.resolve(item);
  };

  handleTabSelect = (key) => {
    this.setState({ groupBy: key });
  };

  handleListOnSelect = (registryKey, item) => {
    return this.getFullItem(registryKey, item, true, false);
  };

  handleListOnDrop = (registryKey, item, target, position) => {
    return this.getFullItem(registryKey, item, false, true);
  };

  render() {
    const { searchTerm, sourcesToggling, searching, sourceList, searchResults, sourcesVisible, inventoryShowSourcesToggling } = this.props;
    const { groupBy } = this.state;

    if (!searchTerm) {
      return null;
    }

    const noSearchResults = Object.keys(searchResults).reduce((acc, key) => acc + searchResults[key].length, 0) === 0;

    if (searching && noSearchResults) {
      return (<Spinner />);
    }

    //todo - this could be its own component
    let groupsContent;

    if (searchTerm && noSearchResults) {
      groupsContent = (<div className="InventoryGroup-placeholderContent">No Results Found</div>);
    } else {
      groupsContent = (groupBy === 'source')
        ?
        sourceList.map(key => {
          if (!searchResults[key]) {
            return null;
          }

          const name = registry[key].name;
          const listingItems = searchResults[key];

          return (
            <InventoryListGroup title={`${name} (${listingItems.length})`}
                                disabled={!listingItems.length}
                                manual
                                isExpanded={sourcesVisible[key]}
                                onToggle={() => this.onListGroupToggle(key)}
                                key={key}
                                dataAttribute={`searchgroup ${name}`}>
              <InventoryList inventoryType={blockDragType}
                             onDrop={(item) => this.handleListOnDrop(key, item)}
                             onSelect={(item) => this.handleListOnSelect(key, item)}
                             items={listingItems}
                             dataAttributePrefix={`searchresult ${name}`}/>
            </InventoryListGroup>
          );
        })
        :
        chain(searchResults)
          .map((sourceResults, sourceKey) => sourceResults.map(block => block.merge({ source: sourceKey })))
          .values()
          .flatten()
          .groupBy('rules.role')
          .map((items, group) => {
            const listingItems = items;
            return (
              <InventoryListGroup title={`${group} (${listingItems.length})`}
                                  disabled={!listingItems.length}
                                  manual
                                  isExpanded={sourcesVisible[group]}
                                  onToggle={() => this.onListGroupToggle(group)}
                                  key={group}
                                  dataAttribute={`searchgroup-role ${group}`}>
                <InventoryList inventoryType={blockDragType}
                               onDrop={(item) => this.handleListOnDrop(item.source, item)}
                               onSelect={(item) => this.handleListOnSelect(item.source, item)}
                               items={listingItems}
                               dataAttributePrefix={`searchresult ${group}`}/>
              </InventoryListGroup>
            );
          })
          .value();
    }

    return (
      <div className="InventoryGroup-contentNester InventorySearchResults">
        {!(!searchTerm || sourcesToggling || (searching && noSearchResults) || noSearchResults) && (
          <InventoryTabs tabs={inventoryTabs}
                         activeTabKey={groupBy}
                         onTabSelect={(tab) => this.handleTabSelect(tab.key)}/>
        )}

        {!sourcesToggling && (
          <div className="InventoryGroup-contentInner no-vertical-scroll">
            {groupsContent}
          </div>
        )}
      </div>
    );
  }
}
