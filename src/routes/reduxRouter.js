import React from 'react';
import { Router, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import store from '../store/index';
import { Route, IndexRedirect, IndexRoute } from 'react-router';

import App from '../containers/App';
import ProjectPage from '../containers/ProjectPage';
import HomePage from '../components/homepage';
import SupportPage from '../components/SupportPage';
import AuthRouteWrapper from '../components/authentication/authRouteWrapper';

const history = syncHistoryWithStore(browserHistory, store, {
  selectLocationState: (state) => state.router,
});

export default (
  <Router history={history}>
    <Route path="/" component={App}>

      {/* require authentication */}

      <Route component={AuthRouteWrapper}>
        <Route path="/homepage/account" component={HomePage}/>
        <Route path="/project/:projectId"
               component={ProjectPage}/>
      </Route>

      {/* do not require authentication */}

      <Route path="/support" component={SupportPage}/>

      <Route path="/homepage">
        <Route path=":comp" component={HomePage}/>
        <IndexRoute component={HomePage}/>
      </Route>

      <IndexRedirect to="/homepage"/>

    </Route>
  </Router>
);
