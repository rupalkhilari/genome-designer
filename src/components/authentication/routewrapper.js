import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux';

class RouteWrapper extends Component {

  static propTypes = {
    user: PropTypes.object,
    children: PropTypes.object,
  };

  constructor(props) {
    super();
  }

  render() {
    return this.props.user.userid ? React.Children.only(this.props.children) : null;
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

export default connect(mapStateToProps, {

})(RouteWrapper);
