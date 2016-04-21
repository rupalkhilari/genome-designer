import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { inventorySearch } from '../../actions/inventory';
import { block as blockDragType } from '../../constants/DragTypes';
import { chain, debounce, escapeRegExp } from 'lodash';

import { registry, getSources } from '../../inventory/registry';
import * as searchApi from '../../middleware/search';

import InventorySources from './InventorySources';
import InventoryTabs from './InventoryTabs';
import InventorySearch from './InventorySearch';
import InventoryList from './InventoryList';
import InventoryListGroup from './InventoryListGroup';

const defaultSearchResults = getSources().reduce((acc, source) => Object.assign(acc, { [source]: [] }), {});

const createSourcesVisible = (valueFunction = () => false) => {
  return getSources().reduce((acc, source) => Object.assign(acc, { [source]: valueFunction(source) }), {});
};

const inventoryTabs = [
  { key: 'source', name: 'By Source' },
  { key: 'type', name: 'By Kind' },
];

export class InventoryGroupSearch extends Component {
  static propTypes = {
    searchTerm: PropTypes.string.isRequired,
    inventorySearch: PropTypes.func.isRequired,
  };

  state = {
    searching: false,
    sourceList: getSources(),
    sourcesVisible: createSourcesVisible(),
    searchResults: defaultSearchResults,
    groupBy: 'source',
  };

  componentDidMount() {
    const searchingFunction = (term, options = null) => {
      this.setState({ searching: true });
      const sourceList = this.state.sourceList;

      searchApi.search(term, options, sourceList)
        .then(searchResults => this.setState({
          searchResults,
          sourcesVisible: createSourcesVisible((source) => !!searchResults[source].length),
          searching: false,
        }))
        .catch(err => {
          console.log('couldnt fetch results!', err);
          this.setState({
            searchResults: defaultSearchResults,
            searching: false,
          });
        });
    };

    this.debouncedSearch = debounce(searchingFunction, 200);
  }

  onListGroupToggle = (source) => {
    this.setState({
      sourcesVisible: Object.assign(this.state.sourcesVisible, { [source]: !this.state.sourcesVisible[source] }),
    });
  };

  onSourceToggle = (source) => {
    const { sourceList } = this.state;
    const newSourceList = sourceList.length ? sourceList.slice() : getSources();

    //xor, reset if empty
    const indexOfSource = newSourceList.indexOf(source);
    if (indexOfSource >= 0) {
      newSourceList.splice(indexOfSource, 1);
      if (newSourceList.length === 0) {
        newSourceList.push(...getSources());
      }
    } else {
      newSourceList.push(source);
    }

    this.setState({ sourceList: newSourceList });
  };

  getFullItem = (registryKey, item) => {
    const { source, id } = item.source;
    if (source && id) {
      return registry[source].get(id);
    }
    return Promise.resolve(item);
  };

  handleTabSelect = (key) => {
    this.setState({ groupBy: key });
  };

  handleSearchChange = (value) => {
    this.props.inventorySearch(value);
    this.debouncedSearch(value);
  };

  handleListOnSelect = (registryKey, item) => {
    return this.getFullItem(registryKey, item);
  };

  handleListOnDrop = (registryKey, item, target, position) => {
    return this.getFullItem(registryKey, item);
  };

  //want to filter down results while next query running
  filterListItems = list => {
    const { searchTerm } = this.props;
    const { searching } = this.state;

    if (!searching) return list;

    const searchRegex = new RegExp(escapeRegExp(searchTerm), 'gi');
    return list.filter(item => searchRegex.test(item.metadata.name) || searchRegex.test(item.rules.sbol));
  };

  render() {
    const { searchTerm } = this.props;
    const { searching, sourceList, searchResults, sourcesVisible, groupBy } = this.state;

    //doesnt account for filtering...
    const noSearchResults = Object.keys(searchResults).reduce((acc, key) => acc + searchResults[key].length, 0) === 0;

    //this is a bit ugly, and would be nice to break up more meaningfully... would require a lot of passing down though
    // could do this sorting when the results come in?
    //nested ternary - null if no lengths, then handle based on groupBy
    const groupsContent = noSearchResults ?
      null :
      (groupBy === 'source')
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
                                key={key}>
              <InventoryList inventoryType={blockDragType}
                             onDrop={(item) => this.handleListOnDrop(key, item)}
                             onSelect={(item) => this.handleListOnSelect(key, item)}
                             items={listingItems}/>
            </InventoryListGroup>
          );
        })
        :
        chain(searchResults)
          .map((sourceResults, sourceKey) => sourceResults.map(block => block.merge({ source: sourceKey })))
          .values()
          .flatten()
          .groupBy('rules.sbol')
          .map((items, group) => {
            const listingItems = items;
            return (
              <InventoryListGroup title={`${group} (${listingItems.length})`}
                                  disabled={!listingItems.length}
                                  manual
                                  isExpanded={sourcesVisible[group]}
                                  onToggle={() => this.onListGroupToggle(group)}
                                  key={group}>
                <InventoryList inventoryType={blockDragType}
                               onDrop={(item) => this.handleListOnDrop(item.source, item)}
                               onSelect={(item) => this.handleListOnSelect(item.source, item)}
                               items={listingItems}/>
              </InventoryListGroup>
            );
          })
          .value();

    return (
      <div className={'InventoryGroup-content InventoryGroupSearch'}>
        <InventorySearch searchTerm={searchTerm}
                         isSearching={searching}
                         onSearchChange={this.handleSearchChange}/>
        <InventorySources registry={registry}
                          sourceList={sourceList}
                          onSourceToggle={this.onSourceToggle}/>
        {!noSearchResults && (<InventoryTabs tabs={inventoryTabs}
                                             activeTabKey={groupBy}
                                             onTabSelect={(tab) => this.handleTabSelect(tab.key)}/>)}

        <div className="InventoryGroup-contentInner">
          {groupsContent}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  const { searchTerm } = state.inventory;

  return {
    searchTerm,
  };
}

export default connect(mapStateToProps, {
  inventorySearch,
})(InventoryGroupSearch);
