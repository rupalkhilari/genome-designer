import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { uiSetCurrent } from '../../../actions/ui';
import { projectAddConstruct } from '../../../actions/projects';
import {
  blockCreate,
  blockAddComponent,
  blockClone,
} from '../../../actions/blocks';
import { uiSetCurrentConstruct } from '../../../actions/ui';
import { projectGetVersion } from '../../../selectors/projects';
import DnD from '../dnd/dnd';

export class ConstructViewerCanvas extends Component {

  static propTypes = {

  };

  constructor(props) {
    super(props);
  }

  /**
   * create a new construct, add dropped block to it
   */
  onDrop(globalPosition, payload, event) {
    // make new construct
    const construct = this.props.blockCreate();
    this.props.projectAddConstruct(this.props.currentProjectId, construct.id);
    // add block(s) to construct
    const blocks = Array.isArray(payload.item) ? payload.item : [payload.item];
    const projectVersion = this.props.projectGetVersion(this.props.currentProjectId);
    blocks.forEach((block, index) => {
      const clone = this.props.blockClone(block, projectVersion);
      this.props.blockAddComponent(construct.id, clone.id, index);
    });
    // select the new construct
    this.props.uiSetCurrentConstruct(construct.id);
  }

  /**
   * register as drop target when mounted, use -1 for zorder to ensure
   * higher values ( constructviewers ) will get dropped on first
   */
  componentDidMount() {
    DnD.registerTarget(ReactDOM.findDOMNode(this), {
      drop: this.onDrop.bind(this),
      zorder: -1,
    });
  }

  /**
   * clicking on canvas unselects all blocks
   */
  onClick = (evt) => {
    if (evt.target === ReactDOM.findDOMNode(this)) {
      evt.preventDefault();
      evt.stopPropagation();
      this.props.uiSetCurrent([]);
    }
  };

  /**
   * render the component, the scene graph will render later when componentDidUpdate is called
   */
  render() {
    // map construct viewers so we can propagate projectId and any recently dropped blocks
    return (<div className="ProjectPage-constructs" onClick={this.onClick}>
      {this.props.children}
    </div>);
  }
}

function mapStateToProps(state, props) {
  return {
    projects: state.projects,
  };
}

export default connect(mapStateToProps, {
  uiSetCurrent,
  projectAddConstruct,
  blockCreate,
  blockAddComponent,
  projectGetVersion,
  uiSetCurrentConstruct,
  blockClone,
})(ConstructViewerCanvas);
