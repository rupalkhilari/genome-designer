import React, { Component, PropTypes } from 'react';

//for now, assumes only blocks. Later, may need to pass a type as well

export default class InspectorContent extends Component {
  static propTypes = {
    instance: PropTypes.object.isRequired,
  }

  render() {
    const { instance } = this.props;

    return (
      <div className="InspectorContent InspectorContentBlock">
        <h4 className="InspectorContent-heading">Name</h4>
        <p>{instance.metadata.name || 'Unnamed'}</p>

        <h4 className="InspectorContent-heading">Description</h4>
        <p>{instance.metadata.description || 'No Description'}</p>
      </div>
    );
  }
}
