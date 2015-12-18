import React, { Component, PropTypes } from 'react';

import GlobalNav from './GlobalNav';

import '../styles/App.css';

export class App extends Component {
  static propTypes = {
    children: PropTypes.node, // Injected by React Router
  }

  render() {
    const { children } = this.props;
    return (
      <div className="App">
        <GlobalNav />
        <div className="App-pageContent">
          {children}
        </div>
      </div>
    );
  }
}

export default App;
