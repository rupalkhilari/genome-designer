import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { uiSetCurrent } from '../../../actions/ui';
import { projectAddConstruct } from '../../../actions/projects';
import { blockCreate } from '../../../actions/blocks';
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
    const block = this.props.blockCreate();
    this.props.projectAddConstruct(this.props.currentProjectId, block.id);
    // add the dropped block(s) to the construct, tragically this is complicated
    // and is already handled by the construct viewers. So hack in a way to pass
    // the payload to any newly constructed construct viewer.
    this.droppedBlocks = payload;
    this.forceUpdate();
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
  }

  /**
   * render the component, the scene graph will render later when componentDidUpdate is called
   */
  render() {
    // map construct viewers so we can propagate projectId and any recently dropped blocks
    return (<div className="ProjectPage-constructs" onClick={this.onClick}>
      {this.props.children}
    </div>)
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
})(ConstructViewerCanvas);
