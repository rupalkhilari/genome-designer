import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import SketchConstruct from '../components/SketchConstruct'

class ConstructPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <h1>Construct {this.props.constructId}</h1>

        <SketchConstruct />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { projectId, constructId } = state.router.params;
  return {
    projectId,
    constructId
  };
}

export default connect(mapStateToProps)(ConstructPage);
