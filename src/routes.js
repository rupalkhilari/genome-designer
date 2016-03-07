import React, { Component, PropTypes } from 'react';
import { Route, IndexRoute, Redirect, IndexRedirect } from 'react-router';

import App from './containers/App';
import DashboardPage from './containers/DashboardPage';
import ProjectPage from './containers/ProjectPage';
import AboutPage from './components/AboutPage';
import HomePage from './components/homepage';
import SupportPage from './components/SupportPage';
import RouteWrapper from './components/authentication/routewrapper';



//Routes are specified as a separate component so they can hotloaded
//see: https://github.com/rackt/redux-router/issues/44#issuecomment-140198502


export default(
  <Route path="/" component={App}>

    <Route component={RouteWrapper}>
      <Route path="/auth/account" component={HomePage}/>
      <Route path="/project/:projectId" component={ProjectPage}/>
    </Route>
    <Route path="/about" component={AboutPage}/>
    <Route path="/support" component={SupportPage}/>
    <Route path="/auth/signin" component={HomePage}/>
    <Route path="/auth/signup" component={HomePage}/>
    <Route path="/auth/reset" component={HomePage}/>
    <Route path="/auth/forgot" component={HomePage}/>
    <Route path="/homepage" component={HomePage}/>

    <IndexRedirect to="/homepage" />

  </Route>
);
