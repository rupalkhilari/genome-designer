import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

class DashboardPage extends Component {

  render() {
    return (
      <div>
        <h1>Dashboard</h1>

        <p>Why don't you look at the Project <Link to="/project/test">Test</Link>?</p>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(DashboardPage);
