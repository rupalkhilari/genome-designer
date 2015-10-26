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
        <h1>Construct</h1>

        <SketchConstruct />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(ConstructPage);
