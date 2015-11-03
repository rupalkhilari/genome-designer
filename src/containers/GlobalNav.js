import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';
import { project_create } from '../actions/projects';

import ProjectSelect from '../components/ProjectSelect';

import styles from '../styles/GlobalNav.css';
import withStyles from '../decorators/withStyles';

@withStyles(styles)
class GlobalNav extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    projects: PropTypes.object.isRequired,
    inputValue: PropTypes.string.isRequired,
    project_create: PropTypes.func.isRequired,
    pushState: PropTypes.func.isRequired,
  }

  handleChange = (nextValue) => {
    const { pushState, project_create, projects } = this.props;

    //todo - this should be run in the project page or route transition, not here
    //note that this relies on projects with name as ID
    let project = projects[nextValue];
    if (!project) {
      project = project_create(nextValue);
    }

    pushState(null, `/project/${project.id}`);
  }

  render() {
    return (
      <div className="GlobalNav">
          <Link className="GlobalNav-title"
                to="/">Home</Link>
        <ProjectSelect value={this.props.inputValue}
                       onChange={this.handleChange} />

      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    projects : state.projects,
    inputValue: state.router.params.projectId || ''
  };
}

export default connect(mapStateToProps, {
  pushState,
  project_create,
})(GlobalNav);
