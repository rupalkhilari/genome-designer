import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { projectAddConstruct } from '../actions';

import { makeConstruct } from '../utils/randomGenerators';
import range from '../utils/range';

import SketchConstruct from '../components/SketchConstruct';

class ProjectPage extends Component {
  static propTypes = {
    project            : PropTypes.object.isRequired,
    projectId          : PropTypes.string.isRequired,
    projectAddConstruct: PropTypes.func.isRequired,
    constructId        : PropTypes.string //only visible if a construct is selected
  }

  addConstruct = (e) => {
    let {projectId} = this.props,
        lengths = range(3).map(() => Math.floor(Math.random() * 1000));

    this.props.projectAddConstruct(projectId, makeConstruct(...lengths));
  }

  render () {
    const { children, projectId, constructId, project } = this.props;

    let constructSelected = !!constructId;

    return (
      <div>
        <h1>Project {projectId}</h1>

        {/* if viewing specific construct, let routing take over*/}
        {constructSelected && children}

        {/* otherwise, show all the constructs... */}
        {!constructSelected && project.components && project.components.map(construct => {
          return (
            <div key={construct.id}>
              <h3><Link to={`/project/${projectId}/${construct.id}`}>Construct {construct.metadata.name}</Link></h3>
              <SketchConstruct construct={construct}/>
            </div>
          )
        })}

        <div>
          <hr />
          <a onClick={this.addConstruct}>Add Construct</a>
        </div>
      </div>
    );
  }
}

function mapStateToProps (state) {
  const { projectId, constructId } = state.router.params;
  const project = state.projects[projectId] || {};

  return {
    projectId,
    constructId,
    project
  };
}

export default connect(mapStateToProps, {
  projectAddConstruct
})(ProjectPage);
