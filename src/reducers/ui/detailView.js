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
import * as ActionTypes from '../../constants/ActionTypes';
import invariant from 'invariant';
import { LOCATION_CHANGE } from 'react-router-redux';

export const initialState = {
  isVisible: false,
  currentExtension: null,
};

export default function detailView(state = initialState, action) {
  switch (action.type) {
  case ActionTypes.DETAIL_VIEW_TOGGLE_VISIBILITY :
    const { nextState } = action;
    return Object.assign({}, state, { isVisible: nextState });

  case ActionTypes.DETAIL_VIEW_SELECT_EXTENSION :
    const { manifest } = action;
    if (!manifest || manifest === state.currentExtension) {
      return state;
    }
    invariant(manifest.name && typeof manifest.render === 'function', 'must pass the extension manifest, which has a name and render()');
    return Object.assign({}, state, { currentExtension: manifest });

  case ActionTypes.USER_SET_USER :
  case LOCATION_CHANGE :
    return Object.assign({}, initialState);

  default :
    return state;
  }
}
