import * as ActionTypes from '../constants/ActionTypes';
import uuid from 'node-uuid';

import Block from '../models/Block';

export const blockCreate = (initialModel) => {
  return (dispatch, getState) => {
    const block = new Block(initialModel);

    return Promise.resolve(block)
      .then((block) => {
        dispatch({
          type: ActionTypes.BLOCK_CREATE,
          block,
        });
        return block;
      });
  };
};

export const blockClone = (blockId) => {
  return (dispatch, getState) => {
    const oldBlock = getState().blocks[blockId];

    //hack - should hit the server with fetch()
    const cloneStub = Object.assign({}, oldBlock, {
      id: uuid.v4(),
      parent: oldBlock.id,
    });

    return Promise.resolve(cloneStub)
      .then((block) => {
        dispatch({
          type: ActionTypes.BLOCK_CLONE,
          block,
        });
        return block;
      });
  };
};

//this is a backup for performing arbitrary mutations
export const blockMerge = (blockId, toMerge) => {
  return (dispatch, getState) => {
    const oldBlock = getState().blocks[blockId];
    const block = oldBlock.merge(toMerge);

    return Promise.resolve(block)
      .then((block) => {
        dispatch({
          type: ActionTypes.BLOCK_MERGE,
          block,
        });
        return block;
      });
  };
};

export const blockRename = (blockId, name) => {
  return (dispatch, getState) => {
    const oldBlock = getState().blocks[blockId];
    const block = oldBlock.mutate('metadata.name', name);

    return Promise.resolve(block)
      .then((block) => {
        dispatch({
          type: ActionTypes.BLOCK_RENAME,
          block,
        });
        return block;
      });
  };
};

export const blockAddComponent = (blockId, componentId, index) => {
  return (dispatch, getState) => {
    const oldBlock = getState().blocks[blockId];
    const block = oldBlock.addComponent(componentId, index);

    return Promise.resolve(block)
      .then((block) => {
        dispatch({
          type: ActionTypes.BLOCK_ADD_COMPONENT,
          block,
        });
        return block;
      });
  };
};

//not ready yet
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
