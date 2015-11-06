import * as ActionTypes from '../constants/ActionTypes';
import makeActionCreator from './makeActionCreator';

import { makePart } from '../utils/schemaGenerators';

export const partCreate = () => {
  return (dispatch, getState) => {
    const part = makePart();
    dispatch({
      type: ActionTypes.PART_CREATE,
      part,
    });
    return part;
  };
};

//updates the name of a part
export const partRename = makeActionCreator(ActionTypes.PART_RENAME, 'partId', 'name');
