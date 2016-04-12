import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import invariant from 'invariant';
import { push } from 'react-router-redux';
import MenuBar from '../components/Menu/MenuBar';
import UserWidget from '../components/authentication/userwidget';
import RibbonGrunt from '../components/ribbongrunt';
import {
  projectCreate,
  projectAddConstruct,
  projectSave
} from '../actions/projects';
import {
  focusBlocks,
  focusBlocksAdd,
  focusBlocksToggle,
  focusConstruct,
} from '../actions/focus';
import { clipboardSetData } from '../actions/clipboard';
import * as clipboardFormats from '../constants/clipboardFormats';
import {
  blockCreate,
  blockClone,
  blockRemoveComponent,
  blockAddComponent,
 } from '../actions/blocks';
 import {
   blockGetParents,
   blockGetChildrenRecursive,
 } from '../selectors/blocks';
import { projectGetVersion } from '../selectors/projects';
import { undo, redo } from '../store/undo/actions';
import {
  uiShowGenBankImport,
  uiToggleDetailView,
  uiSetGrunt,
 } from '../actions/ui';
import { inspectorToggleVisibility } from '..//actions/inspector';
import { inventoryToggleVisibility } from '..//actions/inventory';
import { uiShowDNAImport } from '../actions/ui';

import KeyboardTrap from 'mousetrap';
import {
  microsoft,
  apple,
  stringToShortcut,
  translate,
} from '../utils/ui/keyboard-translator';

import '../styles/GlobalNav.css';

class GlobalNav extends Component {
  static propTypes = {
    undo: PropTypes.func.isRequired,
    redo: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    projectCreate: PropTypes.func.isRequired,
    projectAddConstruct: PropTypes.func.isRequired,
    projectSave: PropTypes.func.isRequired,
    currentProjectId: PropTypes.string,
    blockCreate: PropTypes.func.isRequired,
    showMainMenu: PropTypes.bool.isRequired,
  };

  state = {
    showAddProject: false,
    recentProjects: [],
  };

  constructor(props) {
    super(props);

    // keyboard shortcuts
    //
    // ************ FILE MENU ***********
    KeyboardTrap.bind('mod+s', (evt) => {
      evt.preventDefault();
      this.saveProject();
    });
    KeyboardTrap.bind('ctrl+n', (evt) => {
      evt.preventDefault();
      this.newProject();
    });
    KeyboardTrap.bind('shift+ctrl+n', (evt) => {
      evt.preventDefault();
      this.newConstruct();
    });
    // ************ EDIT MENU ***********
    KeyboardTrap.bind('mod+z', (evt) => {
      evt.preventDefault();
      this.props.undo();
    });
    KeyboardTrap.bind('mod+shift+z', (evt) => {
      evt.preventDefault();
      this.props.redo();
    })
    // select all/cut/copy/paste
    KeyboardTrap.bind('mod+a', (evt) => {
      evt.preventDefault();
      this.onSelectAll();
    });
    KeyboardTrap.bind('mod+x', (evt) => {
      evt.preventDefault();
      this.cutFocusedBlocksToClipboard();
    });
    KeyboardTrap.bind('mod+c', (evt) => {
      evt.preventDefault();
      this.copyFocusedBlocksToClipboard();
    });
    KeyboardTrap.bind('mod+v', (evt) => {
      evt.preventDefault();
      this.pasteBlocksToConstruct();
    });
    // **************** VIEW ******************
    KeyboardTrap.bind('shift+mod+i', (evt) => {
      evt.preventDefault();
      this.props.inventoryToggleVisibility();
    });
    KeyboardTrap.bind('mod+i', (evt) => {
      evt.preventDefault();
      this.props.inspectorToggleVisibility();
    });
  }

  /**
   * select all blocks of the current construct
   */
  onSelectAll() {
    this.props.focusBlocks(this.props.blockGetChildrenRecursive(this.props.focus.construct).map(block => block.id));
  }

  /**
   * save current project and signal this as the most recent project to reopen
   */
  saveProject() {
    this.props.projectSave(this.props.currentProjectId);
  }

  /**
   * new project and navigate to new project
   */
  newProject() {
    const project = this.props.projectCreate();
    this.props.push(`/project/${project.id}`);
  }

  /**
   * add a new construct to the current project
   */
  newConstruct() {
    const block = this.props.blockCreate();
    this.props.projectAddConstruct(this.props.currentProjectId, block.id);
    this.props.focusConstruct(block.id);
  }

  /**
   * get the given blocks index in its parent
   */
  blockGetIndex(blockId) {
    // get parent
    const parentBlock = this.blockGetParent(blockId);
    invariant(parentBlock, 'expected a parent');
    const index = parentBlock.components.indexOf(blockId);
    invariant(index >= 0, 'expect the block to be found in components of parent');
    return index;
  }
  /**
   * get parent block of block with given id
   */
  blockGetParent(blockId) {
    const parentId = this.props.blockGetParents(blockId)[0];
    const parentBlock = this.props.blocks[parentId];
    return parentBlock;
  }
  /**
   * truthy if the block has a parent
   */
  blockHasParent(blockId) {
    return this.props.blockGetParents(blockId).length;
  }

  /**
   * path is a representation of length of the path of the given block back to root.
   * e.g. if the block is the 4th child of a 2nd child of a 5th child its true index would be:
   *  [ (index in construct) 4, (2nd child of a block in the construct) 1, (4th child of 2nd child of construct) 3]
   *  [4,1,3]
   */
  getBlockPath(blockId) {
    let path = [];
    let current = blockId;
    while (this.blockHasParent(current)) {
      path.unshift(this.blockGetIndex(current));
      current = this.blockGetParent(current).id;
    }
    return path;
  }

  /**
   * compare two results from getBlockPath, return truthy is a >= b
   */
  compareBlockPaths(tia, tib) {
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
  }

  /**
   * return the block we are going to insert after
   */
  findInsertBlock() {
    // get true indices of all the focused blocks
    const trueIndices = this.props.focus.blocks.map(block => this.getBlockPath(block));
    trueIndices.sort(this.compareBlockPaths);
    // the highest index/path will be the last item
    const highest = trueIndices.pop();
    // now locate the block and returns its parent id and the index to start inserting at
    let current = this.props.focus.construct;
    let index = 0;
    let blockIndex = -1;
    let blockParent = null;
    do {
      blockIndex = highest[index];
      blockParent = current;
      current = this.props.blocks[current].components[blockIndex];
    } while (++index < highest.length);
    // return index + 1 to make the insert occur after the highest selected block
    return {
      parent: blockParent,
      blockIndex: blockIndex + 1,
    };
  }

  // copy the focused blocks to the clipboard using a deep clone
  copyFocusedBlocksToClipboard() {
    if (this.props.focus.blocks.length) {
      const clones = this.props.focus.blocks.map(block => {
        return this.props.blockClone(block, this.props.currentProjectId);
      });
      this.props.clipboardSetData([clipboardFormats.blocks], [clones])
    }
  }

  /**
   * select all the empty blocks in the current construct
   */
  selectEmptyBlocks() {
    const allChildren = this.props.blockGetChildrenRecursive(this.props.focus.construct);
    const emptySet = allChildren.filter(block => !block.hasSequence()).map(block => block.id);
    this.props.focusBlocks(emptySet);
    if (!emptySet.length) {
      this.props.uiSetGrunt('There are no empty blocks in the current construct');
    }
  }

  // get parent of block
  getBlockParentId(blockId) {
    return this.props.blockGetParents(blockId)[0];
  }

  // cut focused blocks to the clipboard, no clone required since we are removing them.
  cutFocusedBlocksToClipboard() {
    if (this.props.focus.blocks.length) {
      // copy the focused blocks before removing
      const blocks = this.props.focus.blocks.slice().map(blockId => this.props.blocks[blockId]);
      this.props.focus.blocks.forEach(blockId => {
        this.props.blockRemoveComponent(this.getBlockParentId(blockId), blockId);
      });
      this.props.clipboardSetData([clipboardFormats.blocks], [blocks]);
    }
  }
  // paste from clipboard to current construct
  pasteBlocksToConstruct() {
    // paste blocks into construct if format available
    const index = this.props.clipboard.formats.indexOf(clipboardFormats.blocks);
    if (index >= 0) {
      const blocks = this.props.clipboard.data[index];
      invariant(blocks && blocks.length && Array.isArray(blocks), 'expected array of blocks on clipboard for this format');
      // get current construct
      const construct = this.props.blocks[this.props.focus.construct];
      invariant(construct, 'expected a construct');
      // we have to clone the blocks currently on the clipboard since they
      // can't be pasted twice
      const clones = blocks.map(block => {
        return this.props.blockClone(block.id, this.props.currentProjectId);
      });
      // insert at end of construct if no blocks selected
      let insertIndex = construct.components.length;
      let parentId = construct.id;
      if (this.props.focus.blocks.length) {
        const insertInfo = this.findInsertBlock();
        insertIndex = insertInfo.blockIndex;
        parentId = insertInfo.parent;
      }
      // add to construct
      clones.forEach(block => {
        this.props.blockAddComponent(parentId, block.id, insertIndex++);
      });
      // select the clones
      this.props.focusBlocks(clones.map(block => block.id));
    }
  }

  menuBar() {
    return (<MenuBar
      menus={[
        {
          text: 'FILE',
          items: [
            {
              text: 'Save Project',
              shortcut: stringToShortcut('meta S'),
              action: () => {
                this.saveProject();
              },
            },
            {},
            {
              text: 'New Project',
              shortcut: stringToShortcut('ctrl N'),
              action: () => {
                this.newProject();
              },
            }, {
              text: 'New Construct',
              shortcut: stringToShortcut('shift ctrl N'),
              action: () => {
                this.newConstruct();
              },
            }, {
              text: 'New Block',
              action: () => {},
            }, {}, {
              text: 'Upload Genbank File',
              action: () => {
                this.props.uiShowGenBankImport(true);
              },
            }, {
              text: 'Download Genbank File',
              action: () => {},
            },
          ],
        },
        {
          text: 'EDIT',
          items: [
            {
              text: 'Undo',
              shortcut: stringToShortcut('meta z'),
              action: () => {
                this.props.undo();
              },
            }, {
              text: 'Redo',
              shortcut: stringToShortcut('shift meta z'),
              action: () => {
                this.props.redo();
              },
            }, {}, {
              text: 'Select All',
              shortcut: stringToShortcut('meta A'),
              disabled: !this.props.focus.construct,
              action: () => {
                this.onSelectAll();
              },
            }, {
              text: 'Cut',
              shortcut: stringToShortcut('meta X'),
              disabled: !this.props.focus.blocks.length,
              action: () => {
                this.cutFocusedBlocksToClipboard();
              },
            }, {
              text: 'Copy',
              shortcut: stringToShortcut('meta C'),
              disabled: !this.props.focus.blocks.length,
              action: () => {
                this.copyFocusedBlocksToClipboard();
              },
            }, {
              text: 'Paste',
              shortcut: stringToShortcut('meta V'),
              disabled: !this.props.clipboard.formats.includes(clipboardFormats.blocks),
              action: () => {
                this.pasteBlocksToConstruct();
              },
            }, {}, {
              text: 'Rename',
              action: () => {},
            }, {
              text: 'Duplicate',
              action: () => {},
            }, {
              text: 'Delete',
              action: () => {},
            }, {}, {
              text: 'Import DNA Sequence',
              action: () => {
                this.props.uiShowDNAImport(true);
              },
            }, {}, {
              text: 'Select Empty Blocks',
              disabled: !this.props.focus.construct,
              action: () => {
                this.selectEmptyBlocks();
              },
            },
          ],
        },
        {
          text: 'VIEW',
          items: [
            {
              text: 'Inventory',
              checked: this.props.inventory,
              action: this.props.inventoryToggleVisibility,
              shortcut: stringToShortcut('shift meta i'),
            }, {
              text: 'Inspector',
              checked: this.props.inspectorVisible,
              action: this.props.inspectorToggleVisibility,
              shortcut: stringToShortcut('meta i'),
            }, {
              text: 'Sequence Details',
              action: () => {

              },
              checked: false,
            }, {}, {
              text: 'Block Style',
              disabled: true,
            }, {
              text: 'Labels Only',
              checked: false,
            }, {
              text: 'Symbols Only',
              checked: false,
            }, {
              text: 'Labels + Symbols',
              checked: false,
            }, {}, {
              text: 'Select Empty Blocks',
              disabled: !this.props.focus.construct,
              action: () => {
                this.selectEmptyBlocks();
              },
            },
          ],
        },
        {
          text: 'HELP',
          items: [
            {
              text: 'User Guide',
              action: () => {},
            }, {
              text: 'Show Tutorial',
              action: () => {},
            }, {
              text: 'Keyboard Shortcuts',
              action: () => {},
            }, {
              text: 'Community Forum',
              action: () => {},
            }, {
              text: 'Get Support',
              action: () => {},
            }, {
              text: 'Give Us Feedback',
              action: () => {},
            }, {}, {
              text: 'About Genome Designer',
              action: () => {},
            }, {
              text: 'Terms of Use',
              action: () => {},
            }, {
              text: 'Privacy Policy',
              action: () => {},
            },
          ],
        },
      ]}/>);
  }

  render() {
    return (
      <div className="GlobalNav">
        <RibbonGrunt />
        <span className="GlobalNav-title">GD</span>
        {this.props.showMainMenu ? this.menuBar() : null}
        <UserWidget/>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    showMainMenu: state.ui.showMainMenu,
    focus: state.focus,
    blocks: state.blocks,
    clipboard: state.clipboard,
    inspectorVisible: state.inspector.isVisible,
    inventoryVisible: state.inventory.isVisible,
  };
}

export default connect(mapStateToProps, {
  projectAddConstruct,
  projectCreate,
  projectSave,
  projectGetVersion,
  blockCreate,
  blockClone,
  inspectorToggleVisibility,
  inventoryToggleVisibility,
  blockRemoveComponent,
  blockGetParents,
  blockGetChildrenRecursive,
  uiShowDNAImport,
  undo,
  redo,
  push,
  uiShowGenBankImport,
  uiToggleDetailView,
  uiSetGrunt,
  focusBlocks,
  focusBlocksAdd,
  focusBlocksToggle,
  focusConstruct,
  clipboardSetData,
  blockAddComponent,
})(GlobalNav);
