import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

class DashboardPage extends Component {

  render() {
    return (
      <div>
        <h1>Dashboard</h1>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(DashboardPage);
