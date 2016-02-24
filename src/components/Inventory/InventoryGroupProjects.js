import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { listProjects } from '../../middleware/api';

export class InventoryGroupProjects extends Component {
  static propTypes = {
    projects: PropTypes.object.isRequired,
  };

  state = {
    recentProjects: [],
  };

  componentDidMount() {
    listProjects().then(projects => this.setState({recentProjects: projects}));
  }

  render() {
    const { recentProjects } = this.state;

    const projectList = (!recentProjects.length) ?
      'no projects' :
      recentProjects.map(project => {
        return (<div key={project.id}>{project.metadata.name || 'My Project'}</div>);
      });

    return (
      <div className="InventoryGroup-content InventoryGroupProjects">
        {projectList}
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  //this will list the projects available from this user's session
  const { projects } = state;

  return {
    projects,
  };
}

export default connect(mapStateToProps, {})(InventoryGroupProjects);
