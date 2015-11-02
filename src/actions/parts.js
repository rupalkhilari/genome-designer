import * as ActionTypes from '../constants/ActionTypes';
import makeActionCreator from './makeActionCreator';

import { makePart } from '../utils/schemaGenerators';

export const part_create = () => {
  return (dispatch, getState) => {
    let part = makePart();
    dispatch({
      type: ActionTypes.PART_CREATE,
      part
    });
    return part;
  }
};

//updates the name of a part
export const part_rename = makeActionCreator(ActionTypes.PART_RENAME, 'partId', 'name');