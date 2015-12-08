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
export const blockMerge = (blockId, toMerge) => {
  return (dispatch, getState) => {
    const oldBlock = getState().blocks[blockId];
    const block = oldBlock.merge(toMerge);
    dispatch({
      type: ActionTypes.BLOCK_MERGE,
      block,
    });
    return block;
  };
};

export const blockRename = (blockId, name) => {
  return (dispatch, getState) => {
    const oldBlock = getState().blocks[blockId];
    const block = oldBlock.mutate('metadata.name', name);
    dispatch({
      type: ActionTypes.BLOCK_RENAME,
      block,
    });
    return block;
  };
};

export const blockAddComponent = (blockId, componentId, index) => {
  return (dispatch, getState) => {
    const oldBlock = getState().blocks[blockId];
    const block = oldBlock.addComponent(componentId, index);
    dispatch({
      type: ActionTypes.BLOCK_ADD_COMPONENT,
      block,
    });
    return block;
  };
};

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
