import * as ActionTypes from '../constants/ActionTypes';
import makeActionCreator from './makeActionCreator';

import Block from '../models/Block';

export const blockCreate = (initialModel) => {
  return (dispatch, getState) => {
    const block = new Block(initialModel);
    dispatch({
      type: ActionTypes.BLOCK_CREATE,
      block,
    });
    return block;
  };
};

//this is a backup for performing arbitrary mutations
export const blockMerge = makeActionCreator(ActionTypes.BLOCK_MERGE, 'blockId', 'toMerge');

export const blockRename = makeActionCreator(ActionTypes.BLOCK_RENAME, 'blockId', 'name');

export const blockAddComponent = makeActionCreator(ActionTypes.BLOCK_ADD_COMPONENT, 'blockId', 'componentId');

export const blockSetSequence = (blockId, sequence) => {
  return (dispatch, getState) => {
    //future - also trigger some history actions
    const oldBlock = getState().blocks[blockId];
    //todo - do we want to return the promise? or another action for that? Do we want to follow traditional redux async flow? Where does logic all go?
    const block = oldBlock.setSequence(sequence);
    dispatch({
      type: ActionTypes.BLOCK_SET_SEQUENCE,
      block,
    });
  };
};
