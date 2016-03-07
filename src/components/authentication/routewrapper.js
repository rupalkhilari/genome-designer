import React, { Component, PropTypes } from 'react';
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
    return (
      <div>
        {this.props.user.userid ? this.props.children : null}
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

export default connect(mapStateToProps, {

})(RouteWrapper);
