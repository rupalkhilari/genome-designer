import React from 'react';
import { Route, IndexRoute, Redirect } from 'react-router';

import App from './containers/App';
import DashboardPage from './containers/DashboardPage';
import ProjectPage from './containers/ProjectPage';
import AboutPage from './components/AboutPage';
import SupportPage from './components/SupportPage';
import SunburstPage from './containers/SunburstPage';

//Routes are specified as a separate component so they can hotloaded
//see: https://github.com/rackt/redux-router/issues/44#issuecomment-140198502

export default(
  <Route path="/" component={App}>

    {/* todo - signout page w/ dynamic routing */
      /* todo - signout page w/ dynamic routing */}

    {/* this is temporary pending splash page */}
    <IndexRoute component={DashboardPage}/>

    <Route path="/about"
           component={AboutPage}/>
    <Route path="/support"
           component={SupportPage}/>

    <Route path="/projects"
           component={DashboardPage}/>

    <Route path="/project/:projectId"
           component={ProjectPage}/>

    <Redirect from="/project" to="/"/>
    {/*<Route path="/scenegraph" component={SceneGraphPage}/>*/}
    <Route path="/sunburst" component={SunburstPage}/>
  </Route>
);
