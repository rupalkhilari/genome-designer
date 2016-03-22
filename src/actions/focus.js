import * as ActionTypes from '../constants/ActionTypes';
import * as BlockSelector from '../selectors/blocks';
import invariant from 'invariant';
import {id as idValidatorCreator} from '../schemas/fields/validators';

const idValidator = idValidatorCreator();

export const focusProject = (inputProjectId) => {
  return (dispatch, getState) => {
    const projectId = idValidator(inputProjectId) ? inputProjectId : null;

    dispatch({
      type: ActionTypes.FOCUS_PROJECT,
      projectId,
    });
    return projectId;
  };
};

export const focusConstruct = (inputConstructId) => {
  return (dispatch, getState) => {
    const constructId = idValidator(inputConstructId) ? inputConstructId : null;

    //prune blocks if outside current construct
    const currentBlocks = getState().focus.blocks;
    if (constructId && currentBlocks.length) {
      //const construct = state.blocks[constructId];
      const children = dispatch(BlockSelector.blockGetChildrenRecursive(constructId));
      const blocks = currentBlocks.filter(blockId => {
        return children.some(block => block.id === blockId);
      });
      dispatch({
        type: ActionTypes.FOCUS_BLOCKS,
        blocks,
      });
    }

    dispatch({
      type: ActionTypes.FOCUS_CONSTRUCT,
      constructId,
    });
    return constructId;
  };
};

export const focusBlocks = (blocks) => {
  return (dispatch, getState) => {
    invariant(Array.isArray(blocks), 'must pass array to focus blocks');

    //todo - ensure from same level
    //todo - force construct if different

    dispatch({
      type: ActionTypes.FOCUS_BLOCKS,
      blocks,
    });
    return blocks;
  };
};

export const focusBlocksAdd = (blocksToAdd) => {
  return (dispatch, getState) => {
    invariant(Array.isArray(blocksToAdd), 'must pass array to focus blocks');

    const base = getState().focus.blocks;
    const blocks = [...new Set([...base, ...blocksToAdd])];
    //todo - ensure from same level
    //todo - ensure same construct
    dispatch({
      type: ActionTypes.FOCUS_BLOCKS,
      blocks,
    });
    return blocks;
  };
};

export const focusBlocksToggle = (blocksToToggle) => {
  return (dispatch, getState) => {
    invariant(Array.isArray(blocksToToggle), 'must pass array to focus blocks');

    const { currentBlocks } = getState().ui;
    const blockSet = new Set(currentBlocks);

    blocksToToggle.forEach(block => {
      if (blockSet.has(block)) {
        blockSet.delete(block);
      } else {
        blockSet.add(block);
      }
    });
    const blocks = [...blockSet];

    dispatch({
      type: ActionTypes.FOCUS_BLOCKS,
      blocks,
    });
    return blocks;
  };
};

//pass model, takes precedence
export const focusForceBlocks = (blocks) => {
  return (dispatch, getState) => {
    dispatch({
      type: ActionTypes.FOCUS_FORCE_BLOCKS,
      blocks,
    });
    return blocks;
  };
};

//pass model, takes precedence
export const focusForceProject = (projectId) => {
  return (dispatch, getState) => {
    dispatch({
      type: ActionTypes.FOCUS_FORCE_PROJECT,
      projectId,
    });
    return projectId;
  };
};
