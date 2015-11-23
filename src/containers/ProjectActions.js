import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { blockCreate } from '../actions/blocks';
import { projectAddConstruct } from '../actions/projects';
import { inventoryToggleVisibility } from '../actions/inventory';

import '../styles/ProjectActions.css';

export class ProjectActions extends Component {
  static propTypes = {
    projectId: PropTypes.string.isRequired,
    project: PropTypes.object.isRequired,
    blockCreate: PropTypes.func.isRequired,
    projectAddConstruct: PropTypes.func.isRequired,
    inventoryToggleVisibility: PropTypes.func.isRequired,
  };

  handleClickAddConstruct = (event) => {
    const { projectId, blockCreate, projectAddConstruct } = this.props;
    const construct = blockCreate();
    const constructId = construct.id;

    projectAddConstruct(projectId, constructId);
  }

  handleClickFromInventory = (event) => {
    this.props.inventoryToggleVisibility();
  }

  render() {
    return (
      <div className="ProjectActions">
        <a className="ProjectActions-action"
           onClick={this.handleClickAddConstruct}>
          <span className="dummyButton"></span>
          Add Construct
        </a>
        <a className="ProjectActions-action"
           onClick={this.handleClickFromInventory}>
          <span className="dummyButton"></span>
          From Inventory
        </a>
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  const { projectId } = props;
  const project = state.projects[projectId];
  return {
    projectId,
    project,
  };
}

export default connect(mapStateToProps, {
  blockCreate,
  projectAddConstruct,
  inventoryToggleVisibility,
})(ProjectActions);
