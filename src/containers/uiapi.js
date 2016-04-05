import { clipboardSetData } from '../actions/clipboard';
import * as clipboardFormats from '../constants/clipboardFormats';
import invariant from 'invariant';

/**
 * the given blocks are cloned and the clones are placed in the clipboard
 */
export function copyBlocksToClipboard(blockList, currentProjectId) {
  invariant(blockList, 'expected a list of blocks');
  const clones = blockList.map(function(block) {
    return window.gd.api.blocks.blockClone(block, currentProjectId)();
  });
  window.gd.api.clipboard.clipboardSetData([clipboardFormats.blocks], [clones]);
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
