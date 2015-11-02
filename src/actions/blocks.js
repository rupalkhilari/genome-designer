import * as ActionTypes from '../constants/ActionTypes';
import makeActionCreator from './makeActionCreator';

import { makeBlock } from '../utils/schemaGenerators';

export const block_create = () => {
  return (dispatch, getState) => {
    let block = makeBlock();
    dispatch({
      type: ActionTypes.BLOCK_CREATE,
      block
    });
    return block;
  }
};

export const block_addComponent = makeActionCreator(ActionTypes.BLOCK_ADD_COMPONENT, 'blockId', 'componentId');