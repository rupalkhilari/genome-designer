import React, { Component, PropTypes } from 'react';

import '../../styles/InventorySearch.css';

export default class InventorySearch extends Component {
  static propTypes = {
    searchTerm: PropTypes.string.isRequired,
    onSearchChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
  };

  handleSearchChange = (event) => {
    this.props.onSearchChange(event.target.value);
  };

  render() {
    return (
      <div className="InventorySearch">
        <input className="InventorySearch-input"
               type="text"
               value={this.props.searchTerm}
               placeholder={this.props.placeholder || "Keyword, biological function"}
               onChange={this.handleSearchChange} />
      </div>
    );
  }
}
