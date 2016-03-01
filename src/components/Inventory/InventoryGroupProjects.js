import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { listProjects } from '../../middleware/api';
import { projectGet, projectListAllBlocks } from '../../selectors/projects';
import { projectLoad } from '../../actions/projects';
import { block as blockDragType } from '../../constants/DragTypes';
import InventoryList from './InventoryList';

import '../../styles/InventoryGroupProjects.css';

const loadedProjects = {};

export class InventoryGroupProjects extends Component {
  static propTypes = {
    projectLoad: PropTypes.func.isRequired,
    projectGet: PropTypes.func.isRequired,
    projectListAllBlocks: PropTypes.func.isRequired,
  };

  state = {
    recentProjects: [],
    expandedProjects: {},
  };

  componentDidMount() {
    listProjects().then(projects => this.setState({ recentProjects: projects }));
  }

  toggleExpandProject = (projectId) => {
    // load the project and its blocks into the store
    // later, we'll want a way of pruning the store so it doesn't get too huge
    //this is pretty hack and should be cleaned up
    //todo - should cache this

    const newState = !this.state.expandedProjects[projectId];
    if (newState) {
      const loadedPromise = loadedProjects[projectId]
        ? Promise.resolve(loadedProjects[projectId])
        : this.props.projectLoad(projectId).then(() => this.props.projectListAllBlocks(projectId));

      loadedPromise
        .then(blocks => {
          Object.assign(loadedProjects, { [projectId]: blocks });
          //lame - do this here so dont need to worry about it being undefined in render
          this.setState({
            expandedProjects: Object.assign(this.state.expandedProjects, { [projectId]: newState }),
          });
        });
    } else {
      this.setState({
        expandedProjects: Object.assign(this.state.expandedProjects, { [projectId]: false }),
      });
    }
  };

  render() {
    const { recentProjects, expandedProjects } = this.state;

    const projectList =
      (!recentProjects.length)
        ?
      (<p>no projects</p>)
        :
      recentProjects.map(project => {
        const isExpanded = expandedProjects[project.id];
        return (
          <div key={project.id}
               className={'InventoryItem InventoryGroupProjects-item' + (isExpanded ? ' active' : '')}>
            <span className={'InventoryGroupProjects-item-toggle' + (isExpanded ? ' active' : '')}/>
            <a className="InventoryGroupProjects-item-title"
               onClick={() => this.toggleExpandProject(project.id)}>
              <span>{project.metadata.name || 'My Project'}</span>
            </a>
            {isExpanded && <div className="InventoryGroupProjects-item-contents">
              <InventoryList inventoryType={blockDragType}
                             items={loadedProjects[project.id]}/>
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

export default connect(() => ({}), {
  projectLoad,
  projectGet,
  projectListAllBlocks,
})(InventoryGroupProjects);
