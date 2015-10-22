import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

class ProjectPage extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    projectId : PropTypes.string.isRequired
  }

  render() {
    return (
      <div>
        <h1>Project {this.props.projectId}</h1>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { projectId } = state.router.params;
  return {
    projectId
  };
}

export default connect(mapStateToProps)(ProjectPage);
