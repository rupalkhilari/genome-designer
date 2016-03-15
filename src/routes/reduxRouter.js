import React from 'react';
import { Router, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import store from '../store/index';
import { Route, IndexRedirect } from 'react-router';

import App from '../containers/App';
import ProjectPage from '../containers/ProjectPage';
import AboutPage from '../components/AboutPage';
import HomePage from '../components/homepage';
import SupportPage from '../components/SupportPage';
import RouteWrapper from '../components/authentication/routewrapper';

const history = syncHistoryWithStore(browserHistory, store, {
  selectLocationState: state => state.router,
});

export default (
  <Router history={history}>
    <Route path="/" component={App}>

      <Route component={RouteWrapper}>
        <Route path="/homepage/account" component={HomePage}/>
        <Route path="/project/:projectId"
               component={ProjectPage}/>
      </Route>
      <Route path="/about" component={AboutPage}/>
      <Route path="/support" component={SupportPage}/>
      <Route path="/homepage/signin" component={HomePage}/>
      <Route path="/homepage/signup" component={HomePage}/>
      <Route path="/homepage/reset" component={HomePage}/>
      <Route path="/homepage/forgot" component={HomePage}/>
      <Route path="/homepage" component={HomePage}/>

      <IndexRedirect to="/homepage"/>

    </Route>
  </Router>
);
