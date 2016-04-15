import invariant from 'invariant';
import { blockGetParents } from '../../selectors/blocks';
import { dispatch } from '../../store/index';

/**
 * sort blocks according to the position in the
 * parent construct AND their level of nesting.
 * Blocks higher in the resulting list are further from the root of
 * the construct. Blocks at greater depths of nesting are
 * always considered lower than blocks in the parent hierarchy.
 * e.g. given this arrangement of blocks, with selected ones
 * denoted by letters....
 * [ - ][ A ][ - ][ C ][ - ]
 *        |
 *      [ B ][ - ][ D ]
 *             |
 *           [ E ]
 *
 * After sorting the block [A..E] the order would be:
 * [E, B, D, A, C]
 */
export function sortBlocksByIndexAndDepth(blockIds) {

  const getParents = (blockId) => {
    return dispatch(blockGetParents(blockId));
  };

  const getParent = (blockId) => {
    return getParents(blockId)[0];
  };

  const hasParent = (blockId) => {
    return dispatch(blockGetParents(blockId)).length;
  };

  const getIndex = (blockId) => {
    const parentBlock = getParent(blockId);
    invariant(parentBlock, 'expected a parent');
    const index = parentBlock.components.indexOf(blockId);
    invariant(index >= 0, 'expect the block to be found in components of parent');
    return index;
  };

  /**
   * path is a representation of length of the path of the given block back to root.
   * e.g. if the block is the 4th child of a 2nd child of a 5th child its true index would be:
   *  [ (index in construct) 4, (2nd child of a block in the construct) 1, (4th child of 2nd child of construct) 3]
   *  [4,1,3]
   */
  const getPath = (blockId) => {
    let path = [];
    let current = blockId;
    while (hasParent(current)) {
      path.unshift(getIndex(current));
      current = getParent(current).id;
    }
    return path;
  };

  /**
   * compare two results from getBlockPath, return truthy is a >= b
   */
  const compareBlockPaths = (tia, tib) => {
    let i = 0;
    while (true) {
      if (tia[i] === tib[i] && i < tia.length && i < tib.length) {
        i++;
      } else {
        // this works because for each if the two paths are 2/3/2 and 2/3
        // the final compare of 2 >= null will return true
        // and also null >= null is true
        return tia[i] >= tib[i];
      }
    }
  };

  // get true indices of all the focused blocks
  const trueIndices = blockIds.map(blockId => getPath(blockId));
  trueIndices.sort(compareBlockPaths);
  return trueIndices;
};

/**
 * clear any selected text in the entire document
 */
export function clearSelection() {

  let selection = null;
  if (window.getSelection) {
    selection = window.getSelection();
  } else if (document.selection) {
    selection = document.selection;
  }
  if (selection) {
    if (selection.empty) {
      selection.empty();
    }
    if (selection.removeAllRanges) {
      selection.removeAllRanges();
    }
  }
}
