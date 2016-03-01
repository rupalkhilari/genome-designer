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
    currentProject: PropTypes.string.isRequired,
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
    // this is pretty hack and should be cleaned up
    //todo - dont load blocks into store until the project is loaded (update selector)

    const newState = !this.state.expandedProjects[projectId];
    if (newState) {
      const loadedPromise = !!loadedProjects[projectId]
        ?
        Promise.resolve(loadedProjects[projectId])
        :
        this.props.projectLoad(projectId)
          .then((project) => {
            //move constructs to top, sorted
            const components = project.components;
            const blocks = this.props.projectListAllBlocks(projectId);
            const constructs = blocks.reduce((acc, block, index) => {
              if (components.includes(block.id)) {
                acc.push(block);
                blocks.splice(index, 1);
              }

              return acc;
            }, []);
            constructs.sort((one, two) => components.indexOf(one.id) - components.indexOf(two.id));
            return constructs.concat(blocks);
          });

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
    const { currentProject } = this.props;
    const { recentProjects, expandedProjects } = this.state;

    const projectList =
      (!recentProjects.length)
        ?
        (<p>no projects</p>)
        :
        recentProjects.map(project => {
          const isExpanded = expandedProjects[project.id];
          const isActive = (project.id === currentProject);
          return (
            <div key={project.id}
                 className={'InventoryItem InventoryGroupProjects-item' +
                (isExpanded ? ' expanded' : '') +
                (isActive ? ' active' : '')}>
              <div onClick={() => this.toggleExpandProject(project.id)}>
                <span className={'InventoryGroupProjects-item-toggle' + (isExpanded ? ' expanded' : '')}/>
                <a className="InventoryGroupProjects-item-title">
                  <span>{project.metadata.name || 'My Project'}</span>
                </a>
              </div>
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

function mapStateToProps(state, props) {
  const { projectId } = state.router.params;

  return {
    currentProject: projectId,
  };
}

export default connect(mapStateToProps, {
  projectLoad,
  projectGet,
  projectListAllBlocks,
})(InventoryGroupProjects);
