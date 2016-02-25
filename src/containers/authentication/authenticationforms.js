import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {pushState} from 'redux-router';
import ModalWindow from '../../components//modal/modalwindow';
import SignUpForm from '../../components/authentication/signup';
import SignInForm from '../../components/authentication/signin';
import ForgotForm from '../../components/authentication/forgot';
import ResetForm from '../../components/authentication/reset';
import AccountForm from '../../components/authentication/account';

import '../../../src/styles/authenticationforms.css';

class AuthenticationForms extends Component {
  static propTypes = {
    pushState: PropTypes.func.isRequired,
  };

  constructor() {
    super();
    this.state = {
      modalOpen: true,
      form: 'account',
    };
  }

  render() {

    let form = null;
    switch (this.state.form) {
      case 'signup' : form = <SignUpForm/>; break;
      case 'signin' : form = <SignInForm/>; break;
      case 'forgot' : form = <ForgotForm/>; break;
      case 'reset'  : form = <ResetForm/>; break;
      case 'account': form = <AccountForm/>; break;
    }

    return (
      <div>
        <ModalWindow
          open={this.state.modalOpen}
          title="Auth Modal"
          payload={form}
          closeOnClickOutside
          closeModal={(buttonText) => {
            this.setState({
              modalOpen: false,
            });
          }}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {

  };
}

export default connect(mapStateToProps, {

})(AuthenticationForms);
