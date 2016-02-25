import React from 'react';
import { Route, IndexRoute, Redirect, IndexRedirect } from 'react-router';

import App from './containers/App';
import DashboardPage from './containers/DashboardPage';
import ProjectPage from './containers/ProjectPage';
import AboutPage from './components/AboutPage';
import SupportPage from './components/SupportPage';

//Routes are specified as a separate component so they can hotloaded
//see: https://github.com/rackt/redux-router/issues/44#issuecomment-140198502

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
    <Route path="/project/:projectId" component={ProjectPage}/>

    <IndexRedirect to="/project/test" />

  </Route>
);
