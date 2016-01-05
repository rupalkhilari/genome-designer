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
    inspectorToggleVisibility: PropTypes.func.isRequired,
    forceBlock: PropTypes.object,
    currentBlock: PropTypes.string,
    project: PropTypes.object,
    block: PropTypes.object,
  }

  toggle = (forceVal) => {
    this.props.inspectorToggleVisibility(forceVal);
    window.setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 300);
  }

  render() {
    const { isVisible, forceBlock, currentBlock, block, project } = this.props;

    let content = null;
    if (!!forceBlock) {
      content = <InspectorBlock instance={forceBlock}/>;
    } else {
      if (!!currentBlock) {
        content = (<InspectorBlock instance={block}/>);
      } else if (!!project) {
        content = (<InspectorProject instance={project}/>);
      }
    }

    return (
      <div className={'SidePanel Inspector' + (isVisible ? ' visible' : '')}>

        <div className="SidePanel-heading">
          <span className="SidePanel-heading-trigger Inspector-trigger"
                onClick={() => this.toggle()}/>
          <div className="SidePanel-heading-content">
            <span className="SidePanel-heading-title">Inspector</span>
            <a ref="close"
               className="SidePanel-heading-close"
               onClick={() => this.toggle(false)}/>
          </div>
        </div>

        <div className="SidePanel-content">
          {content}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  const { isVisible } = state.inspector;
  const { currentBlock } = state.ui;
  const block = state.blocks[currentBlock];

  const { projectId } = state.router.params;
  const project = state.projects[projectId];

  return {
    isVisible,
    currentBlock,
    block,
    project,
  };
}

export default connect(mapStateToProps, {
  inspectorToggleVisibility,
})(Inspector);
