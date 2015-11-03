import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { pushState } from 'redux-router';
import { block_create } from '../actions/blocks';
import { project_addConstruct } from '../actions/projects';
import range from '../utils/array/range';

import SketchConstruct from './SketchConstruct';
import ProjectHeader from '../components/ProjectHeader';

import styles from '../styles/ProjectPage.css';
import withStyles from '../decorators/withStyles';

@withStyles(styles)
export class ProjectPage extends Component {
  static propTypes = {
    project             : PropTypes.object.isRequired,
    projectId           : PropTypes.string.isRequired,
    constructId         : PropTypes.string, //only visible if a construct is selected
    block_create        : PropTypes.func.isRequired,
    project_addConstruct: PropTypes.func.isRequired,
    pushState           : PropTypes.func.isRequired,
  }

  handleClickAddConstruct = (e) => {
    let { projectId, block_create, project_addConstruct } = this.props,
        construct = block_create(),
        constructId = construct.id;

    project_addConstruct(projectId, constructId);
  }

  handleClickFromInventory = (e) => {
    //todo
    alert('inventory forthcoming...');
  }

  render () {
    const { children, projectId, constructId, project, constructs } = this.props;

    //todo - need error handling here. Should be in route transition probably?
    //right now there is some handling in GlobalNav when using ProjectSelect. Doesn't handle request of the URL.
    if (!project || !project.metadata) {
      alert('ProjectPage - handle no project in state');
    }

    let constructSelected = !!constructId;

    return (
      <div className="ProjectPage">
        <ProjectHeader project={project}/>

        {/* if viewing specific construct, let routing take over*/}
        {constructSelected && children}

        {/* otherwise, show all the constructs... */}
        {!constructSelected && constructs.map(construct => {
          return (
            <div key={construct.id}>
              <h3>
                <Link to={`/project/${projectId}/${construct.id}`}>
                  Construct {construct.metadata.name}
                </Link>
              </h3>

              <SketchConstruct construct={construct}/>
            </div>
          )
        })}

        <div className="ProjectPage-actions">
          <a className="ProjectPage-action"
             onClick={this.handleClickAddConstruct}>
            <span className="dummyButton"></span>
            Add Construct
          </a>
          <a className="ProjectPage-action"
             onClick={this.handleClickFromInventory}>
            <span className="dummyButton"></span>
            From Inventory
          </a>
        </div>
      </div>
    );
  }
}

function mapStateToProps (state) {
  const { projectId, constructId } = state.router.params,
        project = state.projects[projectId],
        constructs = project.components.map(componentId => state.blocks[componentId]);

  return {
    projectId,
    constructId,
    project,
    constructs,
  };
}

export default connect(mapStateToProps, {
  block_create,
  project_addConstruct,
  pushState,
})(ProjectPage);
