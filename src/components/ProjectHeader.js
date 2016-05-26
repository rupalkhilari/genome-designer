import React, { Component, PropTypes } from 'react';
import {connect } from 'react-redux';
import { inspectorToggleVisibility } from '../actions/ui';
import { focusConstruct, focusBlocks } from '../actions/focus';
import '../styles/ProjectHeader.css';

class ProjectHeader extends Component {
  static propTypes = {
    project: PropTypes.object.isRequired,
  };

  //because we dont need to persist this state, it can exist in the component
  state = {
    detailVisible: false,
  };

  handleToggleDetail = (event) => {
    this.setState({
      detailVisible: !this.state.detailVisible,
    });
  };

  onClick = () => {
    this.props.inspectorToggleVisibility(true);
    this.props.focusConstruct();
    this.props.focusBlocks([]);
  };

  render() {
    const { project } = this.props;

    return (
      <div className="ProjectHeader" onClick={this.onClick}>
        <div className="ProjectHeader-info">
          <div className="ProjectHeader-breadcrumbs">
            <span className="ProjectHeader-breadcrumb ProjectHeader-lead">Projects</span>
            <span className="ProjectHeader-breadcrumb-separator">&#10095;</span>
            <span className="ProjectHeader-breadcrumb ProjectHeader-title">{project.metadata.name || 'Untitled Project'}</span>
          </div>
          <div className="ProjectHeader-description">{project.metadata.description}</div>
        </div>

        <div className="ProjectHeader-actions"></div>
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  return {
  };
}

export default connect(mapStateToProps, {
  inspectorToggleVisibility,
  focusConstruct,
  focusBlocks,
})(ProjectHeader);
