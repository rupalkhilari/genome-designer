import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { inspectorToggleVisibility } from '../actions/ui';

import InspectorBlock from '../components/Inspector/InspectorBlock';
import InspectorProject from '../components/Inspector/InspectorProject';

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

    // inspect instances, or construct if no instance or project if no construct or instances
    const inspect = instances && instances.length
      ? <InspectorBlock instances={instances} readOnly={readOnly}/>
      : <InspectorProject instance={project} readOnly={readOnly}/>;

    return (
      <div className={'SidePanel Inspector no-vertical-scroll' +
      (isVisible ? ' visible' : '') +
      (readOnly ? ' readOnly' : '')}>

        <div className="SidePanel-heading">
          <button tabIndex="-1" className="button-nostyle SidePanel-heading-trigger Inspector-trigger"
                  onClick={() => this.toggle()}/>
          <div className="SidePanel-heading-content">
            <span className="SidePanel-heading-title">Inspector</span>
            <button tabIndex="-1" className="button-nostyle SidePanel-heading-close"
                    onClick={() => this.toggle(false)}/>
          </div>
        </div>

        <div className="SidePanel-content">
          {inspect}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  const { isVisible } = state.ui.inspector;
  const { forceBlocks, blockIds, forceProject, constructId } = state.focus;

  //use forceBlock if available, otherwise use selected blocks
  const unfilteredInstances = forceBlocks.length ?
    forceBlocks :
    (blockIds && blockIds.length) ?
      blockIds.map(blockId => state.blocks[blockId]) :
      [];
  //ensure that blocks removed from store dont error / don't pass empty instances
  let instances = unfilteredInstances.filter(el => !!el);
  if (!instances.length && !!constructId) {
    instances = [state.blocks[constructId]];
  }

  const { projectId } = props; //from routing
  const project = !!forceProject ?
    forceProject :
    state.projects[projectId];

  //readonly if forceBlocks / forceProject
  const readOnly = instances.length ?
    !!forceBlocks.length :
    !!forceProject;

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
