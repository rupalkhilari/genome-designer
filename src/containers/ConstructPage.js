import React, { Component, PropTypes } from 'react';
import { pushState } from 'redux-router';
import { connect } from 'react-redux';

import SketchConstruct from '../components/SketchConstruct'

class ConstructPage extends Component {

  static propTypes = {
    constructId: PropTypes.string.isRequired,
    projectId  : PropTypes.string.isRequired,
    construct  : PropTypes.object.isRequired,
    pushState  : PropTypes.func.isRequired,
  }

  //todo - should probably use proper router hook for this
  componentWillMount () {
    const { projectId, construct } = this.props;

    //Check to make sure Construct exists, e.g. if construct has been deleted
    if (!construct) {
      this.props.pushState(null, `/project/${projectId}`)
    }
  }

  render () {
    const { construct } = this.props;

    return (
      <div>
        <h4>{construct.metadata.name}</h4>

        <SketchConstruct construct={construct}/>
      </div>
    );
  }
}

function mapStateToProps (state) {
  const { projectId, constructId } = state.router.params;

  //todo - this should be in the 'blocks' section of the state
  //todo - this should be a selector
  //react router can probably handle this much better
  const construct = state.projects[projectId].components.find(comp => comp.id === constructId);

  return {
    projectId,
    constructId,
    construct
  };
}

export default connect(mapStateToProps, {
  pushState
})(ConstructPage);
