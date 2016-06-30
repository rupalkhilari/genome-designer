/*
Copyright 2016 Autodesk,Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
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
