import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import invariant from 'invariant';
import { connect } from 'react-redux';
import { projectAddConstruct } from '../../../actions/projects';
import {
  blockCreate,
  blockAddComponent,
  blockClone,
} from '../../../actions/blocks';
import { focusConstruct, focusBlocks } from '../../../actions/focus';
import { projectGetVersion } from '../../../selectors/projects';
import DnD from '../dnd/dnd';
import ConstructViewer from './constructviewer';

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
    const constructViewer = ConstructViewer.getViewerForConstruct(construct.id);
    invariant(constructViewer, 'expect to find a viewer for the new construct');
    constructViewer.addItemAtInsertionPoint(payload, null, null);
    this.props.focusConstruct(construct.id);
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
      this.props.focusBlocks([]);
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
  focusConstruct,
  focusBlocks,
  projectAddConstruct,
  blockCreate,
  blockAddComponent,
  projectGetVersion,
  blockCreate,
  blockClone,
})(ConstructViewerCanvas);
