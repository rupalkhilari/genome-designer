import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { inspectorToggleVisibility } from '../actions/inspector';

import InspectorContent from '../components/InspectorContent';

import '../styles/Inspector.css';
import '../styles/SidePanel.css';

export class Inspector extends Component {
  static propTypes = {
    isVisible: PropTypes.bool.isRequired,
    currentInstance: PropTypes.object,
    inspectorToggleVisibility: PropTypes.func.isRequired,
  }

  render() {
    const { isVisible, currentInstance, inspectorToggleVisibility } = this.props;

    return (
      <div className={'SidePanel Inspector' + (isVisible ? ' visible' : '')}>

        <div className="SidePanel-heading">
          <span className="SidePanel-heading-trigger Inspector-trigger"
                onClick={() => inspectorToggleVisibility()}>i</span>
          <div className="SidePanel-heading-content">
            <span className="SidePanel-title">Inspector</span>
            <a className="SidePanel-close"
               ref="close"
               onClick={inspectorToggleVisibility.bind(null, false)}>&times;</a>
          </div>
        </div>

        <div className="SidePanel-content">
          {!!currentInstance && (<InspectorContent instance={currentInstance}/>)}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  const { isVisible } = state.inspector;
  const { currentInstance } = state.ui;

  return {
    isVisible,
    currentInstance,
  };
}

export default connect(mapStateToProps, {
  inspectorToggleVisibility,
})(Inspector);
