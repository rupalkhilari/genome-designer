import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { pushState } from 'redux-router';
import { projectAddConstruct, projectCreate } from '../actions';
import { makeConstruct, makeProject } from '../utils/randomGenerators';
import range from '../utils/range';

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

  static willTransitionTo (transition, params) {
    const { children, projectId, constructId, project } = this.props;

    console.log('project transition', project);

    //todo - error handle this better - should send them somewhere else?
    //todo - this is a hack. The project should be created using an action. Need to handle route transition checks better. We probably shouldn't make it here.
    //react router can probably handle this much better
    //also should ensure that Project is of the proper format, using propTypes + Schemas, rather than checks in the render method
    if (!project || !project.components) {
      this.props.projectCreate(projectId);
      transition.abort();
    }
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
  projectCreate,
  pushState
})(ProjectPage);
