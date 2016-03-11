import { reduxReactRouter } from 'redux-router';
import createHistory from 'history/lib/createBrowserHistory';
import getRoutes from './routes';

export default reduxReactRouter({ getRoutes, createHistory });
