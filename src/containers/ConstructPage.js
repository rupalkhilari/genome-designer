import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import SketchConstruct from '../components/SketchConstruct'

class ConstructPage extends Component {

  static propTypes = {
    constructId: PropTypes.string.isRequired,
    projectId  : PropTypes.string.isRequired,
    construct  : PropTypes.object.isRequired
  }

  render () {
    const { constructId, construct } = this.props;

    return (
      <div>
        <h1>Construct {constructId}</h1>

        <SketchConstruct construct={construct}/>
      </div>
    );
  }
}

function mapStateToProps (state) {
  const { projectId, constructId } = state.router.params;

  //todo - this should be in the blocks section of the state
  //todo - this should be a selector
  const construct = state.projects[projectId].components.find(comp => comp.id === constructId);

  return {
    projectId,
    constructId,
    construct
  };
}

export default connect(mapStateToProps)(ConstructPage);
