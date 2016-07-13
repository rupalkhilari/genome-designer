/*
 Copyright 2016 Autodesk,Inc.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */
import * as ActionTypes from '../constants/ActionTypes';
import * as BlockSelector from '../selectors/blocks';
import invariant from 'invariant';
import safeValidate from '../schemas/fields/safeValidate';
import { id as idValidatorCreator } from '../schemas/fields/validators';
import Block from '../models/Block';
import Project from '../models/Project';
import { operators } from '../inventory/gsl';
import { symbolMap } from '../inventory/roles'; 

const idValidator = (id) => safeValidate(idValidatorCreator(), true, id);

export const focusProject = (inputProjectId = null) => {
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
    //null is valid to unselect all constructs
    const constructId = idValidator(inputConstructId) ? inputConstructId : null;

    //prune blocks if outside current construct
    const currentBlocks = getState().focus.blockIds;
    if (constructId && currentBlocks.length) {
      const children = dispatch(BlockSelector.blockGetComponentsRecursive(constructId));
      const blockIds = currentBlocks.filter(blockId => {
        return children.some(block => block.id === blockId);
      });
      dispatch({
        type: ActionTypes.FOCUS_BLOCKS,
        blockIds,
      });
    }

    dispatch({
      type: ActionTypes.FOCUS_CONSTRUCT,
      constructId,
    });
    return constructId;
  };
};

export const focusBlocks = (blockIds) => {
  return (dispatch, getState) => {
    invariant(Array.isArray(blockIds), 'must pass array to focus blocks');
    invariant(blockIds.every(block => idValidator(block)), 'must pass array of block IDs');

    if (blockIds.length) {
      const firstBlockId = blockIds[0];
      const construct = dispatch(BlockSelector.blockGetParentRoot(firstBlockId));
      // null => no parent => construct (or detached)... undefined could be soething else
      //const constructId = !!construct ? construct.id : (construct !== null ? firstBlockId : undefined);
      const constructId = construct ? construct.id : undefined;
      if (constructId !== getState().focus.constructId || constructId === firstBlockId) {
        dispatch({
          type: ActionTypes.FOCUS_CONSTRUCT,
          constructId,
        });
      }
    }

    dispatch({
      type: ActionTypes.FOCUS_BLOCKS,
      blockIds,
    });
    return blockIds;
  };
};

export const focusBlocksAdd = (blocksIdsToAdd) => {
  return (dispatch, getState) => {
    invariant(Array.isArray(blocksIdsToAdd), 'must pass array to focus blocks');
    invariant(blocksIdsToAdd.every(block => idValidator(block)), 'must pass array of block IDs');

    const base = getState().focus.blockIds;
    const blockIds = [...new Set([...base, ...blocksIdsToAdd])];

    return dispatch(focusBlocks(blockIds));
  };
};

export const focusBlocksToggle = (blocksToToggle) => {
  return (dispatch, getState) => {
    invariant(Array.isArray(blocksToToggle), 'must pass array to focus blocks');

    const currentBlockIds = getState().focus.blockIds;
    const blockSet = new Set(currentBlockIds);

    blocksToToggle.forEach(block => {
      if (blockSet.has(block)) {
        blockSet.delete(block);
      } else {
        blockSet.add(block);
      }
    });
    const blockIds = [...blockSet];

    return dispatch(focusBlocks(blockIds));
  };
};

//pass model, takes precedence
export const focusForceBlocks = (blocks) => {
  return (dispatch, getState) => {
    invariant(blocks.every(block => Block.validate(block, false)), 'each block must pass validation to focus it');

    dispatch({
      type: ActionTypes.FOCUS_FORCE_BLOCKS,
      blocks,
    });
    return blocks;
  };
};

//pass model, takes precedence
export const focusForceProject = (project) => {
  return (dispatch, getState) => {
    invariant(Project.validate(project, false), 'must pass a valid project');

    dispatch({
      type: ActionTypes.FOCUS_FORCE_PROJECT,
      project,
    });
    return project;
  };
};

export const focusPrioritize = (level = 'project') => {
  return (dispatch, getState) => {
    invariant(['project', 'construct', 'block', 'gsl', 'role'].indexOf(level) >= 0, 'must pass a valid type to give priority to');

    dispatch({
      type: ActionTypes.FOCUS_PRIORITIZE,
      level,
    });
    return level;
  };
};

export const focusGsl = (gslId) => {
  return (dispatch, getState) => {
    invariant(operators[gslId], 'must pass a valid GSL operator ID');

    dispatch({
      type: ActionTypes.FOCUS_GSL_OPERATOR,
      gslId,
    });
  };
};

export const focusRole = (roleId) => {
  return (dispatch, getState) => {
    invariant(symbolMap[roleId], 'must pass a valid Role ID');

    dispatch({
      type: ActionTypes.FOCUS_ROLE,
      roleId,
    });
  };
};

export const focusBlockOption = (blockId, optionId) => {
  return (dispatch, getState) => {
    invariant(idValidator(blockId) && idValidator(optionId), 'must pass valid block ID and optionId');

    const oldOptions = getState().focus.options;
    const options = Object.assign({}, oldOptions, { [blockId]: optionId });

    dispatch({
      type: ActionTypes.FOCUS_BLOCK_OPTION,
      options,
    });
    return options;
  };
};
