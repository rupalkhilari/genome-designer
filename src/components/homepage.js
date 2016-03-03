import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import { uiShowAuthenticationForm, uiSetGrunt } from '../actions/ui';
import '../styles/homepage.css';

export default class HomePage extends Component {

  static propTypes = {
    uiShowAuthenticationForm: PropTypes.func.isRequired,
    uiSetGrunt: PropTypes.func.isRequired,
  };

  constructor() {
    super();
  }

  signIn(evt) {
    evt.preventDefault();
    this.props.uiShowAuthenticationForm('signin');
  }

  signUp(evt) {
    evt.preventDefault();
    this.props.uiShowAuthenticationForm('signup');
  }

  render() {
    return (
      <div className="homepage">
        <div className="faceplate">
          <a href="/" onClick={this.signIn.bind(this)}>Sign In</a>
          <a href="/" onClick={this.signUp.bind(this)}>Sign Up</a>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps, {
  uiShowAuthenticationForm,
  uiSetGrunt,
})(HomePage);
