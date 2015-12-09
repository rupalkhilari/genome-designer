import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';
import { projectCreate } from '../actions/projects';
import { blockCreate } from '../actions/blocks';
import { projectAddConstruct } from '../actions/projects';
import { inventoryToggleVisibility } from '../actions/inventory';

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

  render() {
    const { currentProjectId } = this.props;

    return (
      <div className="GlobalNav">
        <Link className="GlobalNav-title"
              to="/">Home</Link>
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
