import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { listProjects } from '../../middleware/api';
import { projectGet, projectListAllBlocks } from '../../selectors/projects';
import { projectLoad } from '../../actions/projects';
import { block as blockDragType } from '../../constants/DragTypes';

import InventoryListGroup from './InventoryListGroup';
import InventoryList from './InventoryList';

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

  handleToggleProject = (nextState, projectId) => {
    //todo - dont load blocks into store until the project is loaded (update selector)

    const loadedPromise = !nextState || !!loadedProjects[projectId]
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
        })
        .then(blocks => {
          Object.assign(loadedProjects, { [projectId]: blocks });
          return loadedProjects[projectId];
        });

    return loadedPromise
      .then(() => this.setState({
        expandedProjects: Object.assign(this.state.expandedProjects, { [projectId]: nextState }),
      }));
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
          const isActive = (project.id === currentProject);
          const isExpanded = expandedProjects[project.id];
          return (
            <InventoryListGroup key={project.id}
                                title={project.metadata.name || 'My Project'}
                                manual
                                isExpanded={isExpanded}
                                onToggle={(nextState) => this.handleToggleProject(nextState, project.id)}
                                isActive={isActive}>
              <InventoryList inventoryType={blockDragType}
                             items={loadedProjects[project.id]}/>
            </InventoryListGroup>
          );
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
