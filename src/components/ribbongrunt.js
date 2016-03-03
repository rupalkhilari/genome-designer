import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux';
import 'isomorphic-fetch';
import invariant from 'invariant';
import '../../src/styles/ribbongrunt.css';

class RibbonGrunt extends Component {

  static propTypes = {

  };

  constructor() {
    super();
  }

  render() {
    return (
      <div className="ribbongrunt">Your are now logged in as Duncan Meech ( duncanmeech@gmail.com )</div>
    );
  }
}
function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps, {

})(RibbonGrunt);
