import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

class ConstructPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <h1>Construct</h1>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(ConstructPage);
