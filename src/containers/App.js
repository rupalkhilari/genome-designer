import React, { Component, PropTypes } from 'react';
import GlobalNav from './GlobalNav';
import AuthenticationForms from './authentication/authenticationforms';


import '../styles/App.css';

export class App extends Component {
  static propTypes = {
    children: PropTypes.node, // Injected by React Router
  };

  render() {
    const { children } = this.props;

    const DevTools = (process.env.NODE_ENV !== 'production') ? require('./DevTools') : 'div';

    return (
      <div className="App">
        <GlobalNav />
        <AuthenticationForms />
        <div className="App-pageContent">
          {children}
        </div>
        <DevTools />
      </div>
    );
  }
}

export default App;
