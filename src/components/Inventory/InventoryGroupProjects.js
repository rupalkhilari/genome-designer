import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { listProjects } from '../../middleware/api';
import { projectGet, projectListAllBlocks } from '../../selectors/projects';
import { projectLoad } from '../../actions/projects';

import '../../styles/InventoryGroupProjects.css';

export class InventoryGroupProjects extends Component {
  static propTypes = {
    projects: PropTypes.object.isRequired,
    projectLoad: PropTypes.func.isRequired,
    projectGet: PropTypes.func.isRequired,
    projectListAllBlocks: PropTypes.func.isRequired,
  };

  state = {
    recentProjects: [],
    expandedProjects: {},
  };

  componentDidMount() {
    listProjects().then(projects => this.setState({recentProjects: projects}));
  }

  toggleExpandProject = (projectId) => {
    // load the project and its blocks into the store
    // later, we'll want a way of pruning the store so it doesn't get too huge
    //this is pretty hack and should be cleaned up
    this.props.projectLoad(projectId)
    .then(() => this.props.projectListAllBlocks(projectId))
    .then(blocks => {
      this.setState({
        expandedProjects: Object.assign(this.state.expandedProjects, {[projectId]: blocks}),
      });
    });
  };

  render() {
    const { recentProjects, expandedProjects } = this.state;

    const projectList = (!recentProjects.length) ?
      'no projects' :
      recentProjects.map(project => {
        const isExpanded = expandedProjects[project.id];

        return (
          <div key={project.id}
               className="InventoryItem InventoryGroupProjects-item">
            <span className={'InventoryGroupProjects-item-toggle' + (isExpanded ? ' active': '')}/>
            <a className="InventoryGroupProjects-item-title"
               onClick={() => this.toggleExpandProject(project.id)}>
              <span>{project.metadata.name || 'My Project'}</span>
            </a>
            {isExpanded && <div className="InventoryGroupProjects-item-contents">
            {expandedProjects[project.id].map((block, index) => {
              //todo - order constructs first
              return (<div key={block.id}>
                <span>{block.metadata.name || `Block ${index + 1}`}</span>
              </div>);
            })}
            </div>}
          </div>);
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

export default connect(mapStateToProps, {
  projectLoad,
  projectGet,
  projectListAllBlocks,
})(InventoryGroupProjects);
