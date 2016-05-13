import invariant from 'invariant';
import { merge } from 'lodash';
import * as ActionTypes from '../constants/ActionTypes';
import BlockDefinition from '../schemas/Block';
import Block from '../models/Block';
import { loadBlock } from '../middleware/data';
import * as selectors from '../selectors/blocks';
import * as projectSelectors from '../selectors/projects';
import * as undoActions from '../store/undo/actions';
import { pauseAction, resumeAction } from '../store/pausableStore';

//todo - helper to wrap dispatch()'s in a paused transaction - make sure dispatch still runs when passed as arg

//Promise
//retrieves a block, and its components if specified
export const blockLoad = (blockId, withComponents = false) => {
  return (dispatch, getState) => {
    return loadBlock(blockId, withComponents)
      .then(blockMap => {
        const blocks = Object.keys(blockMap).map(key => new Block(blockMap[key]));
        dispatch({
          type: ActionTypes.BLOCK_LOAD,
          blocks,
        });
        return blocks;
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

//this is a backup for performing arbitrary mutations. You probably shouldn't use this.
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
    //will default to null if parentProjectId is undefined
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

    dispatch({
      type: ActionTypes.BLOCK_CLONE,
      blocks: clones,
    });

    //return the clone of root passed in
    const rootId = cloneIdMap[oldBlock.id];
    const root = clones.find(clone => clone.id === rootId);
    return root;
  };
};

//deletes blocks from store
//need to run this sequentially
export const blockDelete = (...blocks) => {
  return (dispatch, getState) => {
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

    dispatch(undoActions.commit());
    dispatch(resumeAction());

    return blocks;
  };
};

//remove blocks from constructs / projects, but leave in the store
//need to run this sequentially
export const blockDetach = (...blockIds) => {
  return (dispatch, getState) => {
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

export const blockAddComponent = (blockId, componentId, index = -1, forceProjectId = false) => {
  return (dispatch, getState) => {
    const oldParent = dispatch(selectors.blockGetParents(componentId)).shift();
    const oldBlock = getState().blocks[blockId];
    const component = getState().blocks[componentId];

    const componentProjectId = component.getProjectId();
    const nextParentProjectId = oldBlock.getProjectId();

    dispatch(pauseAction());
    dispatch(undoActions.transact());

    //verify projectId match, set if appropriate (forceProjectId is true, or not set in component being added)
    if (componentProjectId !== nextParentProjectId) {
      invariant(!componentProjectId || forceProjectId === true, 'cannot add component with different projectId! set forceProjectId = true to overwrite.');

      //there may be scenarios where we are adding to a detached block, so lets avoid the error when next parent has no project
      if (nextParentProjectId) {
        const updatedComponent = component.setProjectId(nextParentProjectId);
        dispatch({
          type: ActionTypes.BLOCK_STASH,
          block: updatedComponent,
        });
      }
    }

    //remove component from old parent (should clone first to avoid this, this is to handle just moving)
    if (oldParent) {
      dispatch(blockRemoveComponent(oldParent.id, componentId));
    }

    //now update the parent
    const block = oldBlock.addComponent(componentId, index);
    dispatch({
      type: ActionTypes.BLOCK_COMPONENT_ADD,
      undoable: true,
      block,
    });

    dispatch(undoActions.commit());
    dispatch(resumeAction());

    return block;
  };
};

/**
 * add the array of componentIds into the given part at the given starting index. Rather than adding them all at once, dispatch an event for each to ensure we remove from previous parents and stay in a valid state.
 */
export const blockAddComponents = (blockId, componentIds, index) => {
  return (dispatch, getState) => {
    dispatch(pauseAction());
    dispatch(undoActions.transact());

    componentIds.forEach((componentId, subIndex) => {
      dispatch(blockAddComponent(blockId, componentId, index + subIndex));
    });

    dispatch(undoActions.commit());
    dispatch(resumeAction());

    return componentIds;
  };
};

//move within same parent, new index (pass index to be at after spliced out)
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
      type: ActionTypes.BLOCK_SET_ROLE,
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
