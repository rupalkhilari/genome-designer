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
import * as ActionTypes from '../constants/ActionTypes';
import invariant from 'invariant';

export const clipboardSetData = (formats, data) => {
  return (dispatch, getState) => {
    invariant(Array.isArray(formats), 'expected formats to be an array of formats');
    invariant(Array.isArray(data), 'expected data to an array of data');
    dispatch({
      type: ActionTypes.CLIPBOARD_SET_DATA,
      formats: formats,
      data: data,
    });
    return {formats, data};
  };
};
