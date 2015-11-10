import * as ActionTypes from '../constants/ActionTypes';
import makeActionCreator from './makeActionCreator';

import { makeBlock } from '../utils/schemaGenerators';

export const blockCreate = () => {
  return (dispatch, getState) => {
    const block = makeBlock();
    dispatch({
      type: ActionTypes.BLOCK_CREATE,
      block,
    });
    return block;
  };
};

export const blockAddComponent = makeActionCreator(ActionTypes.BLOCK_ADD_COMPONENT, 'blockId', 'componentId');
