import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';
import { projectCreate } from '../actions/projects';
import { blockCreate } from '../actions/blocks';
import { projectAddConstruct } from '../actions/projects';
import { inventoryToggleVisibility } from '../actions/inventory';


import MenuBar from '../components/Menu/MenuBar';
import Menu from '../components/Menu/Menu';
import MenuItem from '../components/Menu/MenuItem';
import MenuSeparator from '../components/Menu/MenuSeparator';


import '../styles/GlobalNav.css';

class GlobalNav extends Component {
  static propTypes = {
    projects: PropTypes.object.isRequired,
    inputValue: PropTypes.string.isRequired,
    projectCreate: PropTypes.func.isRequired,
    pushState: PropTypes.func.isRequired,
    blockCreate: PropTypes.func.isRequired,
    currentProjectId: PropTypes.string,
    projectAddConstruct: PropTypes.func.isRequired,
    inventoryToggleVisibility: PropTypes.func.isRequired,
  }

  state = {
    showAddProject: false,
  }

  handleClickInventory = (event) => {
    this.props.inventoryToggleVisibility();
  }

  handleClickAddProject = (event) => {
    const { pushState, projectCreate } = this.props;
    projectCreate().then(project => {
      pushState(null, `/project/${project.id}`);
    });
  }

  handleClickAddConstruct = (event) => {
    const { currentProjectId, blockCreate, projectAddConstruct } = this.props;
    blockCreate()
      .then(block => {
        projectAddConstruct(currentProjectId, block.id);
      });
  }

  /**
   * generic unhandled menu item
   * @return {[type]} [description]
   */
  onMenuItem = () => {

  }

  render() {
    const { currentProjectId } = this.props;

    return (
      <div className="GlobalNav">
        <Link className="GlobalNav-title"
              to="/">GD</Link>
        <MenuBar menus={[
          <Menu title="FILE" menuItems={[
            <MenuItem text="Recent Projects" onClick={this.onMenuItem}></MenuItem>,
            <MenuSeparator/>,
            <MenuItem text="New Project" onClick={this.onMenuItem}></MenuItem>,
            <MenuItem text="New Construct" onClick={this.onMenuItem}></MenuItem>,
            <MenuItem text="New Construct from Clipboard" onClick={this.onMenuItem}></MenuItem>,
            <MenuItem text="New Instance" onClick={this.onMenuItem}></MenuItem>,
            <MenuSeparator/>,
            <MenuItem text="Invite Collaborators" onClick={this.onMenuItem}></MenuItem>,
            <MenuItem text="Upload Genbank File" onClick={this.onMenuItem}></MenuItem>,
            <MenuItem text="Download Genbank File" onClick={this.onMenuItem}></MenuItem>,
            <MenuItem text="Export PDF" onClick={this.onMenuItem}></MenuItem>,
            <MenuSeparator/>,
            <MenuItem text="Publish to Gallery" onClick={this.onMenuItem}></MenuItem>,
          ]}></Menu>,

          <Menu title="EDIT" menuItems={[
            <MenuItem text="Undo" onClick={this.onMenuItem}></MenuItem>,
            <MenuItem text="Redo" onClick={this.onMenuItem}></MenuItem>,
            <MenuSeparator/>,
            <MenuItem text="Cut" onClick={this.onMenuItem}></MenuItem>,
            <MenuItem text="Copy" onClick={this.onMenuItem}></MenuItem>,
            <MenuItem text="Copy As..." onClick={this.onMenuItem}></MenuItem>,
            <MenuItem text="Paste" onClick={this.onMenuItem}></MenuItem>,
            <MenuSeparator/>,
            <MenuItem text="Rename" onClick={this.onMenuItem}></MenuItem>,
            <MenuItem text="Duplicate" onClick={this.onMenuItem}></MenuItem>,
            <MenuItem text="Delete" onClick={this.onMenuItem}></MenuItem>,
            <MenuSeparator/>,
            <MenuItem text="Crop Sequence to Selection" onClick={this.onMenuItem}></MenuItem>,
            <MenuSeparator/>,
            <MenuItem text="Convert to List" onClick={this.onMenuItem}></MenuItem>,
            <MenuItem text="Convert to Construct" onClick={this.onMenuItem}></MenuItem>,
          ]}></Menu>,

          <Menu title="VIEW" menuItems={[
            <MenuItem text="Inventory" onClick={this.onMenuItem}></MenuItem>,
            <MenuItem text="Inspector" onClick={this.onMenuItem}></MenuItem>,
            <MenuItem text="Toolbar" onClick={this.onMenuItem}></MenuItem>,
            <MenuItem text="History" onClick={this.onMenuItem}></MenuItem>,
            <MenuItem text="Sequence" onClick={this.onMenuItem}></MenuItem>,
            <MenuSeparator/>,
            <MenuItem text="Hide/Show Annotations" onClick={this.onMenuItem}></MenuItem>,
            <MenuItem text="Hide/Show List Contents" onClick={this.onMenuItem}></MenuItem>,
            <MenuItem text="Compare..." onClick={this.onMenuItem}></MenuItem>,
            <MenuSeparator/>,
            <MenuItem text="Labels Only" onClick={this.onMenuItem}></MenuItem>,
            <MenuItem text="Symbols Only" onClick={this.onMenuItem}></MenuItem>,
            <MenuItem text="Labels + Symbols" onClick={this.onMenuItem}></MenuItem>,
            <MenuItem text="Custom" onClick={this.onMenuItem}></MenuItem>,
            <MenuSeparator/>,
            <MenuItem text="Full Width" onClick={this.onMenuItem}></MenuItem>,
            <MenuItem text="Compact" onClick={this.onMenuItem}></MenuItem>,
            <MenuItem text="Wrap" onClick={this.onMenuItem}></MenuItem>,
            <MenuSeparator/>,
            <MenuItem text="Preview Deletions" onClick={this.onMenuItem}></MenuItem>,
          ]}></Menu>,

        <Menu title="HELP" menuItems={[
          <MenuItem text="User Guide" onClick={this.onMenuItem}></MenuItem>,
          <MenuItem text="Show Tutorial" onClick={this.onMenuItem}></MenuItem>,
          <MenuItem text="Keyboard Shortcuts" onClick={this.onMenuItem}></MenuItem>,
          <MenuItem text="Community Forum" onClick={this.onMenuItem}></MenuItem>,
          <MenuItem text="Get Support" onClick={this.onMenuItem}></MenuItem>,
          <MenuItem text="Give Us Feedback" onClick={this.onMenuItem}></MenuItem>,
          <MenuSeparator/>,
          <MenuItem text="About Genome Designer" onClick={this.onMenuItem}></MenuItem>,
          <MenuItem text="Terms of Use" onClick={this.onMenuItem}></MenuItem>,
          <MenuItem text="Privacy Policy" onClick={this.onMenuItem}></MenuItem>,
          ]}></Menu>,

        ]}></MenuBar>
      </div>
    );
  }

  renderXXX() {
    const { currentProjectId } = this.props;

    return (
      <div className="GlobalNav">
        <Link className="GlobalNav-title"
              to="/">GD</Link>
        <a className="GlobalNav-action"
           disabled={!currentProjectId}
           onClick={this.handleClickInventory}>
          Inventory
        </a>
        <a className={'GlobalNav-action'}
           onClick={this.handleClickAddProject}>
          Add Project
        </a>
        <a className={'GlobalNav-action'}
           disabled={!currentProjectId}
           onClick={this.handleClickAddConstruct}>
          Add Construct
        </a>
        <a className={'GlobalNav-action'}
           disabled //todo - check for current construct / block being selected
           onClick={this.handleClickAddConstruct}>
          Add Block
        </a>

      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    currentProjectId: state.router.params.projectId,
    projects: state.projects,
    inputValue: state.router.params.projectId || '',
  };
}

export default connect(mapStateToProps, {
  pushState,
  blockCreate,
  projectCreate,
  projectAddConstruct,
  inventoryToggleVisibility,
})(GlobalNav);
