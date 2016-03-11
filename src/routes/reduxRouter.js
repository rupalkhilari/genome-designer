import { reduxReactRouter } from 'redux-router';
import createHistory from 'history/lib/createBrowserHistory';
import routes from './routes';

export default reduxReactRouter({ routes, createHistory });
