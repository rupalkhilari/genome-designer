import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { pushState } from 'redux-router';
import { projectAddConstruct } from '../actions';
import { makeConstruct, makeProject } from '../utils/schemaGenerators';
import range from '../utils/array/range';

import SketchConstruct from '../components/SketchConstruct';
import ProjectHeader from '../components/ProjectHeader';

import styles from '../styles/ProjectPage.css';
import withStyles from '../decorators/withStyles';

@withStyles(styles)
export class ProjectPage extends Component {
  static propTypes = {
    project            : PropTypes.object.isRequired,
    projectId          : PropTypes.string.isRequired,
    projectAddConstruct: PropTypes.func.isRequired,
    constructId        : PropTypes.string, //only visible if a construct is selected
    pushState          : PropTypes.func.isRequired,
  }

  handleClickAddConstruct = (e) => {
    let {projectId} = this.props,
        lengths = range(3).map(() => Math.floor(Math.random() * 1000));

    this.props.projectAddConstruct(projectId, makeConstruct(...lengths));
  }

  handleClickFromInventory = (e) => {
    //todo
    alert('inventory forthcoming...');
  }

  render () {
    const { children, projectId, constructId, project } = this.props;

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
        {!constructSelected && project.components && project.components.map(construct => {
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
  const { projectId, constructId } = state.router.params;
  const project = state.projects[projectId];

  return {
    projectId,
    constructId,
    project
  };
}

export default connect(mapStateToProps, {
  projectAddConstruct,
  pushState
})(ProjectPage);
