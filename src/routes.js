import React from 'react';
import { Route, IndexRoute, Redirect, IndexRedirect } from 'react-router';

import App from './containers/App';
import DashboardPage from './containers/DashboardPage';
import ProjectPage from './containers/ProjectPage';
import AboutPage from './components/AboutPage';
import HomePage from './components/homepage';
import SupportPage from './components/SupportPage';

//Routes are specified as a separate component so they can hotloaded
//see: https://github.com/rackt/redux-router/issues/44#issuecomment-140198502

function requireAuth(nextState, replace) {
  //if (!auth.loggedIn()) {
  if (true) {
    replace({
      pathname: '/',
      state: { nextPathname: nextState.location.pathname }
    })
  }
}

export default(
  <Route path="/" component={App}>

    {/* todo - signout page w/ dynamic routing */
      /* todo - signout page w/ dynamic routing */}

    {/*
     //Redirect to project page, use sidepanel, no dashboard.
     <IndexRoute component={DashboardPage}/>
     */}

    <Route path="/about" component={AboutPage}/>
    <Route path="/support" component={SupportPage}/>
    <Route path="/homepage" component={HomePage}/>
    <Route path="/project/:projectId" component={ProjectPage} onEnter={requireAuth}/>

    <IndexRedirect to="/homepage" />

  </Route>
);
