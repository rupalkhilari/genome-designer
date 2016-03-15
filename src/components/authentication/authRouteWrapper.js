import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

class RouteWrapper extends Component {
  static propTypes = {
    user: PropTypes.object,
    children: PropTypes.object,
  };

  render() {
    if (this.props.user.userid) {
      return React.Children.only(this.props.children);
    }

    if (process.env.NODE_ENV !== 'production') {
      console.log('no user for RouteWrapper');
    }

    return null;
  }
}

function mapStateToProps(state) {
  console.log(state);

  return {
    user: state.user,
  };
}

export default connect(mapStateToProps)(RouteWrapper);
