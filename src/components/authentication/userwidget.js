import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import 'isomorphic-fetch';
import { uiShowAuthenticationForm } from '../../actions/ui';

import '../../styles/userwidget.css';

class UserWidget extends Component {

  static propTypes = {
    uiShowAuthenticationForm: PropTypes.func.isRequired,
  };

  onSignIn(evt) {
    evt.preventDefault();
    this.props.uiShowAuthenticationForm('signin');
  }

  render() {
    if (this.props.user.userid) {
      // signed in user
      return (
        <div className="userwidget">
          <div className="signed-in">{this.props.user.email.substr(0, 1)}</div>
        </div>
      )
    }
    // signed out user
    return (
      <div className="userwidget">
        <a href="#" className="signed-out" onClick={this.onSignIn.bind(this)}>SIGN IN</a>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}
export default connect(mapStateToProps, {
  uiShowAuthenticationForm,
})(UserWidget);
