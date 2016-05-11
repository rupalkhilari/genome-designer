import invariant from 'invariant';
import { merge } from 'lodash';
import * as ActionTypes from '../constants/ActionTypes';
import BlockDefinition from '../schemas/Block';
import Block from '../models/Block';
import { saveBlock, loadBlock } from '../middleware/api';
import * as selectors from '../selectors/blocks';
import * as projectSelectors from '../selectors/projects';
import * as undoActions from '../store/undo/actions';
import { pauseAction, resumeAction } from '../store/pausableStore';

//Promise
export const blockSave = (blockId, forceProjectId = false) => {
  return (dispatch, getState) => {
    const block = getState().blocks[blockId];
    const currentProjectId = dispatch(projectSelectors.projectGetCurrentId());
    const projectId = block.getProjectId() || forceProjectId || currentProjectId;
    //todo - should save projectId on the block if its different

    invariant(projectId, 'project ID required to save block');
    return saveBlock(block, projectId)
      .then(block => {
        dispatch({
          type: ActionTypes.BLOCK_SAVE,
          block,
        });
        return block;
      });
  };
};

//Promise
export const blockLoad = (blockId) => {
  return (dispatch, getState) => {
    return loadBlock(blockId)
      .then(block => {
        dispatch({
          type: ActionTypes.BLOCK_LOAD,
          block,
        });
        return block;
      });
  };
};

//useDefaults e.g. to set the projectId automatically
export const blockCreate = (initialModel, useDefaults = true) => {
  return (dispatch, getState) => {
    const toMerge = (useDefaults === true) ?
    { projectId: dispatch(projectSelectors.projectGetCurrentId()) } :
    {};

    const block = new Block(merge(toMerge, initialModel));
    dispatch({
      type: ActionTypes.BLOCK_CREATE,
      block,
    });
    return block;
  };
};

//if you have block models you want in the store this will add them directly
export const blockStash = (...inputBlocks) => {
  return (dispatch, getState) => {
    const blocks = inputBlocks.map(blockObj => new Block(blockObj));
    dispatch({
      type: ActionTypes.BLOCK_STASH,
      blocks,
    });
    return blocks;
  };
};

/**
 * @description
 * Clones a block (and its children by default)
 *
 * @param blockInput {ID|Object} JSON of block directly, or ID. Accept both since inventory items may not be in the store, so we need to pass the block directly. Prefer to use ID.
 * @param parentObjectInput {Object} information about parent, defaults to generated:
 *  {id: from block input
 *   projectId - same as block being cloned, or block.projectId
  *  version - that of project ID if in the store, or first parent if available and same project id
  * }
 * @param shallowOnly {Boolean} Does a deep clone by default, adds all child blocks to store
 * @returns {Object} clone block (root node if has children)
 */
export const blockClone = (blockInput, parentObjectInput = {}, shallowOnly = false) => {
  return (dispatch, getState) => {
    let oldBlock;
    if (typeof blockInput === 'string') {
      oldBlock = getState().blocks[blockInput];
    } else if (BlockDefinition.validate(blockInput)) {
      oldBlock = new Block(blockInput);
    } else {
      throw new Error('invalid input to blockClone', blockInput);
    }

    //get the project ID to use for parent, considering the block may be detached from a project (e.g. inventory block)
    const parentProjectId = oldBlock.getProjectId() || null;
    const parentProjectVersion = dispatch(projectSelectors.projectGetVersion(parentProjectId));

    //partial object about project, block ID handled in block.clone()
    const parentObject = Object.assign({
      projectId: parentProjectId,
      version: parentProjectVersion,
    }, parentObjectInput);

    if (!!shallowOnly || !oldBlock.components.length) {
      const block = oldBlock.clone(parentObject);
      dispatch({
        type: ActionTypes.BLOCK_CLONE,
        block,
      });
      return block;
    }

    const allChildren = dispatch(selectors.blockGetChildrenRecursive(oldBlock.id));
    const allToClone = [oldBlock, ...allChildren];
    //all blocks must be from same project, and all were from given version
    const unmappedClones = allToClone.map(block => block.clone(parentObject));

    //update IDs in components
    const cloneIdMap = allToClone.reduce((acc, next, index) => {
      acc[next.id] = unmappedClones[index].id;
      return acc;
    }, {});
    const clones = unmappedClones.map(clone => {
      const newComponents = clone.components.map(componentId => cloneIdMap[componentId]);
      return clone.mutate('components', newComponents);
    });

    //add clones to the store
    //note, not using the action BLOCK_CLONE
    dispatch({
      type: ActionTypes.BLOCK_STASH,
      blocks: clones,
    });

    //return the clone of root passed in
    const rootId = cloneIdMap[oldBlock.id];
    const root = clones.find(clone => clone.id === rootId);
    return root;
  };
};

//this is a backup for performing arbitrary mutations. You shouldn't use this.
export const blockMerge = (blockId, toMerge) => {
  return (dispatch, getState) => {
    const oldBlock = getState().blocks[blockId];
    const block = oldBlock.merge(toMerge);
    dispatch({
      type: ActionTypes.BLOCK_MERGE,
      undoable: true,
      block,
    });
    return block;
  };
};

//deletes blocks from store
export const blockDelete = (...blocks) => {
  return (dispatch, getState) => {
    //transact for all blocks
    dispatch(pauseAction());
    dispatch(undoActions.transact());

    blocks.forEach(blockId => {
      //find parent, remove component from parent

      const parent = dispatch(selectors.blockGetParents(blockId)).shift();

      //may not have parent (is construct) or parent was deleted
      if (parent) {
        dispatch(blockRemoveComponent(parent, blockId)); //eslint-disable-line no-use-before-define
      }

      dispatch({
        type: ActionTypes.BLOCK_DELETE,
        undoable: true,
        blockId,
      });
    });

    //end transaction
    dispatch(undoActions.commit());
    dispatch(resumeAction());

    return blocks;
  };
};

//remove blocks from constructs / projects, but leave in the store
//todo - verify if need to remove children first so store never in bad state
export const blockDetach = (...blockIds) => {
  return (dispatch, getState) => {
    //transact for all blocks
    dispatch(pauseAction());
    dispatch(undoActions.transact());

    blockIds.forEach(blockId => {
      //find parent, remove component from parent
      const parent = dispatch(selectors.blockGetParents(blockId)).shift();
      //may not have parent (is construct) or parent was deleted
      if (parent) {
        dispatch(blockRemoveComponent(parent.id, blockId)); //eslint-disable-line no-use-before-define
      }
    });

    //end transaction
    dispatch(undoActions.commit());
    dispatch(resumeAction());

    return blockIds;
  };
};


/***************************************
 * Components
 ***************************************/

export const blockRemoveComponent = (blockId, ...componentIds) => {
  return (dispatch, getState) => {
    const oldBlock = getState().blocks[blockId];
    const block = componentIds.reduce((acc, currentId) => {
      return acc.removeComponent(currentId);
    }, oldBlock);

    dispatch({
      type: ActionTypes.BLOCK_COMPONENT_REMOVE,
      undoable: true,
      block,
    });
    return block;
  };
};

export const blockAddComponent = (blockId, componentId, index) => {
  return (dispatch, getState) => {
    const oldParent = dispatch(selectors.blockGetParents(componentId)).shift();
    const oldBlock = getState().blocks[blockId];
    const block = oldBlock.addComponent(componentId, index);
    const actionPayload = {
      type: ActionTypes.BLOCK_COMPONENT_ADD,
      undoable: true,
      block,
    };

    if (oldParent) {
      dispatch(undoActions.transact());
      dispatch(blockRemoveComponent(oldParent.id, componentId));
      dispatch(actionPayload);
      dispatch(undoActions.commit());
    } else {
      dispatch(actionPayload);
    }

    return block;
  };
};

/**
 * add the array of componentIds into the given part at the given starting index. Rather than adding them all at once, dispatch an event for each to ensure we remove from previous parents and stay in a valid state.
 */
export const blockAddComponents = (blockId, componentIds, index) => {
  return (dispatch, getState) => {
    //transact for all blocks
    dispatch(pauseAction());
    dispatch(undoActions.transact());

    componentIds.forEach((componentId, subIndex) => {
      dispatch(blockAddComponent(blockId, componentId, index + subIndex));
    });

    //end transaction
    dispatch(undoActions.commit());
    dispatch(resumeAction());

    return componentIds;
  };
};

//move within same parent, new index
export const blockMoveComponent = (blockId, componentId, newIndex) => {
  return (dispatch, getState) => {
    const oldBlock = getState().blocks[blockId];
    const block = oldBlock.moveComponent(componentId, newIndex);
    dispatch({
      type: ActionTypes.BLOCK_COMPONENT_MOVE,
      undoable: true,
      block,
    });
    return block;
  };
};

/***************************************
 * Metadata things
 ***************************************/

export const blockRename = (blockId, name) => {
  return (dispatch, getState) => {
    const oldBlock = getState().blocks[blockId];

    if (oldBlock.metadata.name === name) {
      return oldBlock;
    }

    const block = oldBlock.setName(name);
    dispatch({
      type: ActionTypes.BLOCK_RENAME,
      undoable: true,
      block,
    });
    return block;
  };
};

export const blockSetColor = (blockId, color) => {
  return (dispatch, getState) => {
    const oldBlock = getState().blocks[blockId];

    if (oldBlock.metadata.color === color) {
      return oldBlock;
    }

    const block = oldBlock.setColor(color);
    dispatch({
      type: ActionTypes.BLOCK_SET_COLOR,
      undoable: true,
      block,
    });
    return block;
  };
};

/**
 * change the role symbol of the block e.g. from the inspector
 */
export const blockSetRole = (blockId, role) => {
  return (dispatch, getState) => {
    const oldBlock = getState().blocks[blockId];

    if (oldBlock.rules.role === role) {
      return oldBlock;
    }

    const block = oldBlock.setRole(role);
    dispatch({
      type: ActionTypes.BLOCK_SET_SBOL,
      undoable: true,
      block,
    });
    return block;
  };
};

//todo - this should not be an action + unclear name. It is too simply composed of existing atomic actions... prevent API bloat
/**
 * e.g. when the user drop an role symbol on an existing block.
 * Create a new child block and set the given role symbol
 */
export const blockAddSbol = (blockId, role) => {
  return (dispatch, getState) => {
    dispatch(undoActions.transact());
    const oldBlock = getState().blocks[blockId];
    const newBlock = dispatch(blockCreate());
    dispatch(blockSetRole(newBlock.id, role));
    dispatch(blockAddComponent(oldBlock.id, newBlock.id, oldBlock.components.length));
    //end transaction
    dispatch(undoActions.commit());
    return newBlock;
  };
};

/***************************************
 * annotations
 ***************************************/

export const blockAnnotate = (blockId, annotation) => {
  return (dispatch, getState) => {
    const oldBlock = getState().blocks[blockId];
    const block = oldBlock.annotate(annotation);
    dispatch({
      type: ActionTypes.BLOCK_ANNOTATE,
      undoable: true,
      block,
    });
    return block;
  };
};

//can pass annotation or annotation name
export const blockRemoveAnnotation = (blockId, annotation) => {
  return (dispatch, getState) => {
    const oldBlock = getState().blocks[blockId];
    const block = oldBlock.removeAnnotation(annotation);
    dispatch({
      type: ActionTypes.BLOCK_REMOVE_ANNOTATION,
      undoable: true,
      block,
    });
    return block;
  };
};


/***************************************
 * Sequence
 ***************************************/

//Non-mutating
//Promise
//ignore format for now
export const blockGetSequence = (blockId, format) => {
  return (dispatch, getState) => {
    const block = getState().blocks[blockId];
    return block.getSequence(format);
  };
};

//Promise
export const blockSetSequence = (blockId, sequence, useStrict) => {
  return (dispatch, getState) => {
    const oldBlock = getState().blocks[blockId];

    return oldBlock.setSequence(sequence, useStrict)
      .then(block => {
        dispatch({
          type: ActionTypes.BLOCK_SET_SEQUENCE,
          undoable: true,
          block,
        });
        return block;
      });
  };
};
