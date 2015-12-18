import React, { Component, PropTypes } from 'react';
import { registry } from '../extensions/index';


import '../styles/ProjectDetailView.css';

//todo - how should this be exposed so that React won't dump it away

export default class ProjectDetailView extends Component {
  static propTypes = {
    project: PropTypes.object.isRequired,
  }

  loadExtension = (manifest) => {
    manifest.render(this.refs.extensionView);
  }

  render() {
    //todo - support resizing
    return (
      <div className="ProjectDetailView">
        <div className="ProjectDetailsView-extensions">
          {registry.sequenceDetail.map(manifest => {
            return (
              <a key={manifest.id}
                 onClick={this.loadExtension.bind(null, manifest)}>{manifest.name}</a>
            );
          })}
        </div>
        <div ref="extensionView"
             className="ProjectDetailView-extensionView"></div>

      </div>
    );
  }
}
