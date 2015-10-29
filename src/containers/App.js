import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import GlobalNav from './GlobalNav';

class App extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    // Injected by React Router
    children: PropTypes.node
  }

  render() {
    const { children } = this.props;
    return (
      <div className="App">
        <GlobalNav />
        <div className="pageContent">
          {children}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps, {
})(App);
