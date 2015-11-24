import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import InputSimple from './InputSimple';

import '../styles/ProjectHeader.css';

export default class ProjectHeader extends Component {
  static propTypes = {
    project: PropTypes.object.isRequired,
  }

  //because we dont need to persist this state, it can exist in the component
  state = {
    detailVisible: false,
  }

  handleToggleDetail = (event) => {
    this.setState({
      detailVisible: !this.state.detailVisible,
    });
  }

  handleProjectRename = (nextValue) => {
    //todo - should be an action
    this.props.project.mutate('metadata.name', nextValue);
  }

  handleProjectDescriptionChange = (nextValue) => {
    this.props.project.mutate('metadata.description', nextValue);
  }

  render() {
    const { project } = this.props;

    return (
      <div className="ProjectHeader">

        <div className="ProjectHeader-info">
          <div className="ProjectHeader-icon"
               style={{
                 backgroundImage: `url(${project.metadata.image})`,
               }}></div>
          <div className="ProjectHeader-text">
            <Link to={`/project/${project.id}`}
                  className="ProjectHeader-title">
              <InputSimple
                onChange={this.handleProjectRename}
                placeholder="Project Name"
                default="My Project"
                updateOnBlur
                value={project.metadata.name}/>
            </Link>
            {this.state.detailVisible &&
              <InputSimple
                onChange={this.handleProjectDescriptionChange}
                placeholder="Project Description"
                default=""
                updateOnBlur
                useTextarea
                value={project.metadata.description}/>
            }
          </div>
        </div>

        <div className="ProjectHeader-actions">
          <span className="ProjectHeader-detailToggle"
                onClick={this.handleToggleDetail}>V</span>
        </div>
      </div>
    );
  }
}
