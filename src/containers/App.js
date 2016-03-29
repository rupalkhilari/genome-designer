import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import GlobalNav from './GlobalNav';
import AuthenticationForms from './authentication/authenticationforms';
import ImportDNAForm from '../components/importdna/importdnaform';

import '../styles/App.css';

class App extends Component {
  static propTypes = {
    children: PropTypes.node, // Injected by React Router
    user: PropTypes.object,
    currentProjectId: PropTypes.string,
  };

  render() {
    const DevTools = (process.env.NODE_ENV !== 'production') ? require('./DevTools') : 'div';

    return (
      <div className="App">
        <GlobalNav currentProjectId={this.props.currentProjectId}/>
        <AuthenticationForms />
        <ImportDNAForm />
        <div className="App-pageContent">
          {this.props.children}
        </div>
        <DevTools />
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    currentProjectId: ownProps.params.projectId,
    user: state.user,
  };
}

export default connect(mapStateToProps, {
})(App);
