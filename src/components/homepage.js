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

  // this route can result from path like 'homepage/signin', 'homepage', 'homepage/register' etc.
  // If the final path is the name of an authorization form we will show it
  componentDidMount() {
    const authForm = window.location.pathname.split('/').pop();
    if (['signin', 'signup', 'account', 'reset', 'forgot'].indexOf(authForm) >= 0) {
      this.props.uiShowAuthenticationForm(authForm);
    }
  }

  signIn(evt) {
    evt.preventDefault();
    this.props.uiShowAuthenticationForm('signin');
  }

  render() {
    return (
      <div className="homepage">
        <img className="homepage-background" src="/images/homepage/background.png"/>
        <img className="homepage-title" src="/images/homepage/genomedesigner.png"/>
        <img className="homepage-autodesk" src="/images/homepage/autodesk-logo.png"/>
        <div className="homepage-getstarted" onClick={this.signIn.bind(this)}>Get started</div>
        <div className="homepage-footer">
          <div className="homepage-footer-list">USA version 1.0
            <ul>
              <li><span>&bull;</span>George Washington</li>
              <li><span>&bull;</span>John Adams</li>
              <li><span>&bull;</span>Thomas Jefferson</li>
              <li><span>&bull;</span>James Madison</li>
              <li><span>&bull;</span>James Monroe</li>
              <li><span>&bull;</span>John Quincy Adams</li>
            </ul>
          </div>
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
