import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

class ProjectPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <h1>Project</h1>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(ProjectPage);
