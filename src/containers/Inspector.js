import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { inspectorToggleVisibility } from '../actions/inspector';

import InspectorContent from '../components/InspectorContent';

import '../styles/Inspector.css';
import '../styles/SidePanel.css';

export class Inspector extends Component {
  static propTypes = {
    isVisible: PropTypes.bool.isRequired,
    inspectorToggleVisibility: PropTypes.func.isRequired,
    currentInstance: PropTypes.string,
    project: PropTypes.object,
    block: PropTypes.object,
  }

  toggle() {
    this.props.inspectorToggleVisibility.call(null);
    window.setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 300);
  }

  render() {
    const { isVisible, currentInstance, block, project, inspectorToggleVisibility } = this.props;

    return (
      <div className={'SidePanel Inspector' + (isVisible ? ' visible' : '')}>

        <div className="SidePanel-heading">
          <span className="SidePanel-heading-trigger Inspector-trigger"
                onClick={this.toggle.bind(this)} />
          <div className="SidePanel-heading-content">
            <span className="SidePanel-title">Inspector</span>
            <a className="SidePanel-close"
               ref="close"
               onClick={this.toggle.bind(this)}>&times;</a>
          </div>
        </div>

        <div className="SidePanel-content">
          {!currentInstance && (<p>nothing selected. you're in project {project.metadata.name}</p>)}
          {!!currentInstance && (<InspectorContent instance={block}/>)}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  const { isVisible } = state.inspector;
  const { currentInstance } = state.ui;
  const block = state.blocks[currentInstance];

  const { projectId } = state.router.params;
  const project = state.projects[projectId];

  return {
    isVisible,
    currentInstance,
    block,
    project,
  };
}

export default connect(mapStateToProps, {
  inspectorToggleVisibility,
})(Inspector);
