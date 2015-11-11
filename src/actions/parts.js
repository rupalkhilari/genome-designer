import * as ActionTypes from '../constants/ActionTypes';
import makeActionCreator from './makeActionCreator';

import Part from '../models/Part';

export const partCreate = () => {
  return (dispatch, getState) => {
    const part = new Part();
    dispatch({
      type: ActionTypes.PART_CREATE,
      part,
    });
    return part;
  };
};

//updates the name of a part
export const partRename = makeActionCreator(ActionTypes.PART_RENAME, 'partId', 'name');
