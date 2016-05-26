import configureStore from './configureStore';
import { getLastAction as lastAction } from './saveLastActionMiddleware';

/* If we were just using redux, without the redux-react and redux-router packages, you would just dispatch events etc. directly from the store. So, we're exporting it separately so it can be used that way e.g. for playing around. However, using those packages, you should use:

 redux-react
    <Provider>
    connect()
 redux-router
    <ReduxRouter>
    reactReduxRouter
    routerStateReducer()
*/

const store = configureStore();

//in general, you will want to use redux's connect() where possible. This is in the event you need direct access
const { dispatch, subscribe, getState, pause, resume, isPaused } = store;
export { lastAction, dispatch, subscribe, getState, pause, resume, isPaused };

export default store;
