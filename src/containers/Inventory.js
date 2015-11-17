import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { inventorySearch, inventoryToggleVisiblity } from '../actions/inventory';

import InventorySearch from '../components/Inventory/InventorySearch';
import InventoryListing from '../components/Inventory/InventoryListing';

import styles from '../styles/Inventory.css';
import withStyles from '../decorators/withStyles';

const dummyBlocks = ['Kozak-ATG-NLS', 'Linker 2', 'Linker 3', 'Kozak-ATG', 'NES-STOP', 'KDEL-STOP', 'Linker 1', 'P2A -1', 'p2A-2', 'Kozak-ATG-palmitoylation sequence', 'Kozak-ATG-IgK leader', 'Kozak-ATG-MLS', 'SV40 intron', 'SV40 polyA', 'SV40 ORI', 'Insulator FB', 'Tetracycline-dep ribozyme', 'PGK polyA', 'BGH-polyA', 'DmrC', 'DmrA', 'SV40 promoter', 'TRE3GS promoter', 'CMV promoter', 'CAG promoter', 'IRES2 (with ATG)', 'PuroR-1', 'PuroR-2', 'PuroR-3', 'mNeonGreen-1', 'mRuby2-1', 'mTagBFP-1', 'mNeonGreen-2', 'mRuby2-2', 'mTagBFP-2', 'mNeonGreen-3', 'mRuby2-3', 'mTagBFP-3', 'Kozak-ATG-Tet-ON-3G', 'Rosa 5 Arm', 'Insulator synthetic IS2', 'Rosa 3 Arm', 'chimaeric intron (from SP203)', 'EF1a promoter', 'Tubulin'];

@withStyles(styles)
export class Inventory extends Component {
  static propTypes = {
    isVisible: PropTypes.bool.isRequired,
    searchTerm: PropTypes.string.isRequired,
    inventorySearch: PropTypes.func.isRequired,
    inventoryToggleVisiblity: PropTypes.func.isRequired,
  }

  handleSearchChange = (value) => {
    const action = this.props.inventorySearch(value);
  }

  render() {
    const { isVisible, searchTerm, inventoryToggleVisiblity } = this.props;
    const searchRegex = new RegExp(searchTerm, 'gi');
    //todo - perf - shuoldnt create new list every time
    const inventoryItems = dummyBlocks.filter((item) => {
      return searchRegex.test(item);
    });

    return (
      <div className={'Inventory' + (isVisible ? ' visible' : '')}>
        <div className="Inventory-heading">
          <span className="Inventory-title">Inventory</span>
          <a className="Inventory-close"
             onClick={inventoryToggleVisiblity.bind(null, false)}>&times;</a>
        </div>
        <InventorySearch searchTerm={searchTerm}
                         onSearchChange={this.handleSearchChange}/>
        <InventoryListing items={inventoryItems}/>
      </div>
    );
  }
}

//todo - add Inventory reducer + actions
function mapStateToProps(state, props) {
  const { isVisible, searchTerm } = state.inventory;

  return {
    isVisible,
    searchTerm,
  };
}

export default connect(mapStateToProps, {
  inventorySearch,
  inventoryToggleVisiblity,
})(Inventory);
