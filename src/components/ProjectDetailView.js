import React, { Component, PropTypes } from 'react';

import '../styles/ProjectDetailView.css';

export default class ProjectDetailView extends Component {
  static propTypes = {
    project: PropTypes.object.isRequired,
  }

  render() {
    //todo - support resizing
    return (
      <div className="ProjectDetailView"></div>
    );
  }
}
