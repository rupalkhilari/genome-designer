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
