import React, { Component, PropTypes, Children } from 'react';
import { pushState } from 'react-router';
import {connect} from 'react-redux';
import 'isomorphic-fetch';
import invariant from 'invariant';

class RouteWrapper extends Component {

  static propTypes = {
  };

  constructor(props) {
    super();
  }

  render() {
    return this.props.user.userid ? Children.only(this.props.children) : null;
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

export default connect(mapStateToProps, {

})(RouteWrapper);
