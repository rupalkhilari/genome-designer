import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
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
 } from '../actions/blocks';
 import {
   blockGetParents,
 } from '../selectors/blocks';
import { projectGetVersion } from '../selectors/projects';
import { undo, redo } from '../store/undo/actions';
import { uiShowGenBankImport } from '../actions/ui';
import { setItem } from '../middleware/localStorageCache';
import { uiShowDNAImport } from '../actions/ui';

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

  // copy the focused blocks to the clipboard using a deep clone
  copyFocusedBlocksToClipboard() {
    debugger;
    if (this.props.focus.blocks.length) {
      const clones = this.props.focus.blocks.map(block => {
        return this.props.blockClone(block, this.props.currentProjectId);
      });
      this.props.clipboardSetData([clipboardFormats.blocks], [[clones]])
    }
  }

  // get parent of block
  getBlockParentId(blockId) {
    return this.props.blockGetParents(blockId)[0];
  }

  // cut focused blocks to the clipboard, no clone required since we are removing them.
  cutFocusedBlocksToClipboard() {
    // copy the focused blocks before removing
    const blocks = this.props.focus.blocks.slice();
    this.props.focus.blocks.forEach(blockId => {
      this.props.blockRemoveComponent(this.getBlockParentId(blockId), blockId);
    });
    this.props.clipboardSetData([clipboardFormats.blocks], [[blocks]])
  }

  menuBar() {
    return (<MenuBar
      menus={[
        {
          text: 'FILE',
          items: [
            {
              text: 'Save Project',
              action: () => {
                this.props.projectSave(this.props.currentProjectId);
                setItem('mostRecentProject', this.props.currentProjectId);
              },
            },
            {},
            {
              text: 'New Project',
              action: () => {
                const project = this.props.projectCreate();
                this.props.push(`/project/${project.id}`);
              },
            }, {
              text: 'New Construct',
              action: () => {
                const block = this.props.blockCreate();
                this.props.projectAddConstruct(this.props.currentProjectId, block.id);
              },
            }, {
              text: 'New Construct from Clipboard',
              action: () => {},
            }, {
              text: 'New Instance',
              action: () => {},
            }, {}, {
              text: 'Invite Collaborators',
              action: () => {},
            }, {
              text: 'Upload Genbank File',
              action: () => {
                this.props.uiShowGenBankImport(true);
              },
            }, {
              text: 'Download Genbank File',
              action: () => {},
            }, {
              text: 'Export PDF',
              action: () => {},
            }, {}, {
              text: 'Publish to Gallery',
              action: () => {},
            },
          ],
        },
        {
          text: 'EDIT',
          items: [
            {
              text: 'Undo',
              action: () => {
                this.props.undo();
              },
            }, {
              text: 'Redo',
              action: () => {
                this.props.redo();
              },
            }, {}, {
              text: 'Cut',
              action: () => {
                this.cutFocusedBlocksToClipboard();
              },
            }, {
              text: 'Copy',
              action: () => {
                this.copyFocusedBlocksToClipboard();
              },
            }, {
              text: 'Paste',
              action: () => {},
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
              text: 'Import DNA',
              action: () => {
                this.props.uiShowDNAImport(true);
              },
            }, {}, {
              text: 'Convert to List',
              action: () => {},
            }, {
              text: 'Convert to Construct',
              action: () => {},
            },
          ],
        },
        {
          text: 'VIEW',
          items: [
            {
              text: 'Inventory',
              action: () => {},
            }, {
              text: 'Inspector',
              action: () => {},
            }, {
              text: 'Toolbar',
              action: () => {},
            }, {
              text: 'History',
              action: () => {},
            }, {
              text: 'Sequence',
              action: () => {},
            }, {}, {
              text: 'Hide/Show Annotations',
              action: () => {},
            }, {
              text: 'Hide/Show List Contents',
              action: () => {},
            }, {
              text: 'Compare...',
              action: () => {},
            }, {}, {
              text: 'Labels Only',
              action: () => {},
            }, {
              text: 'Symbols Only',
              action: () => {},
            }, {
              text: 'Labels + Symbols',
              action: () => {},
            }, {
              text: 'Custom',
              action: () => {},
            }, {}, {
              text: 'Full Width',
              action: () => {},
            }, {
              text: 'Compact',
              action: () => {},
            }, {
              text: 'Wrap',
              action: () => {},
            }, {}, {
              text: 'Preview Deletions',
              action: () => {},
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
    clipboard: state.clipboard,
  };
}

export default connect(mapStateToProps, {
  projectAddConstruct,
  projectCreate,
  projectSave,
  projectGetVersion,
  blockCreate,
  blockClone,
  blockRemoveComponent,
  blockGetParents,
  uiShowDNAImport,
  undo,
  redo,
  push,
  uiShowGenBankImport,
  focusBlocks,
  focusBlocksAdd,
  focusBlocksToggle,
  focusConstruct,
  clipboardSetData,
})(GlobalNav);
