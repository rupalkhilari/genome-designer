/*global flashedUser*/
import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux';
import GlobalNav from './GlobalNav';
import AuthenticationForms from './authentication/authenticationforms';
import RibbonGrunt from '../components/ribbongrunt';

import '../styles/App.css';

class App extends Component {
  static propTypes = {
    children: PropTypes.node, // Injected by React Router
    user: PropTypes.object,
  };

  render() {
    const { children } = this.props;

    const DevTools = (process.env.NODE_ENV !== 'production') ? require('./DevTools') : 'div';

    return (
      <div className="App">
        <GlobalNav />
        <AuthenticationForms />
        <RibbonGrunt />
        <div className="App-pageContent">
          {children}
        </div>
        <DevTools />
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
})(App);
