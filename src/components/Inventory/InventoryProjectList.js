import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { projectList } from '../../actions/projects';
import { blockStash } from '../../actions/blocks';

import InventoryProject from './InventoryProject';
import Spinner from '../ui/Spinner';

export class InventoryProjectList extends Component {
  static propTypes = {
    currentProject: PropTypes.string.isRequired,
    projects: PropTypes.object.isRequired,
    blockStash: PropTypes.func.isRequired,
    projectList: PropTypes.func.isRequired,
  };

  state = {
    isLoading: true,
  };

  //will retrigger on each load
  componentDidMount() {
    this.props.projectList()
      .then(() => this.setState({ isLoading: false }));
  }

  render() {
    const { projects, currentProject } = this.props;
    const { isLoading } = this.state;

    if (isLoading) {
      return <Spinner />;
    }

    return (!Object.keys(projects).length)
      ?
      (<p>no projects</p>)
      :
      <div className="InventoryProjectList">
        {Object.keys(projects).map(projectId => {
          const project = projects[projectId];
          const isActive = (projectId === currentProject);

          return (
            <InventoryProject key={projectId}
                              project={project}
                              isActive={isActive}/>
          );
        })}
      </div>
    ;
  }
}

function mapStateToProps(state, props) {
  const { projects } = state;

  return {
    projects,
  };
}

export default connect(mapStateToProps, {
  blockStash,
  projectList,
})(InventoryProjectList);
