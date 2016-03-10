import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { inspectorToggleVisibility } from '../actions/inspector';

import InspectorBlock from '../components/InspectorBlock';
import InspectorProject from '../components/InspectorProject';

import '../styles/Inspector.css';
import '../styles/SidePanel.css';

export class Inspector extends Component {
  static propTypes = {
    isVisible: PropTypes.bool.isRequired,
    readOnly: PropTypes.bool.isRequired,
    inspectorToggleVisibility: PropTypes.func.isRequired,
    instances: PropTypes.array,
    project: PropTypes.object,
  };

  toggle = (forceVal) => {
    this.props.inspectorToggleVisibility(forceVal);
    window.setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 300);
  };

  render() {
    const { isVisible, instances, project, readOnly } = this.props;

    return (
      <div className={'SidePanel Inspector' +
      (isVisible ? ' visible' : '') +
      (readOnly ? ' readOnly' : '')}>

        <div className="SidePanel-heading">
          <button className="button-nostyle SidePanel-heading-trigger Inspector-trigger"
                  onClick={() => this.toggle()}/>
          <div className="SidePanel-heading-content">
            <span className="SidePanel-heading-title">Inspector</span>
            <button className="button-nostyle SidePanel-heading-close"
                    onClick={() => this.toggle(false)}/>
          </div>
        </div>

        <div className="SidePanel-content">
          {(instances && instances.length) ?
            (<InspectorBlock instances={instances}
                             readOnly={readOnly}/>) :
            (<InspectorProject instance={project}/>) }
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  const { isVisible, forceBlocks } = state.inspector;
  const { currentBlocks, currentConstructId } = state.ui;

  //use forceBlock if available, otherwise use selected blocks
  const instances = forceBlocks.length ?
    forceBlocks :
    (currentBlocks && currentBlocks.length) ?
      currentBlocks.map(blockId => state.blocks[blockId]) :
      (currentConstructId) ?
        [state.blocks[currentConstructId]] :
        [];

  const readOnly = forceBlocks.length >= 1;

  const { projectId } = state.router.params;
  const project = state.projects[projectId];

  return {
    isVisible,
    readOnly,
    instances,
    project,
  };
}

export default connect(mapStateToProps, {
  inspectorToggleVisibility,
})(Inspector);
