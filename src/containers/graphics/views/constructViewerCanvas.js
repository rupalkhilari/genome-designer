import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import invariant from 'invariant';
import { connect } from 'react-redux';
import { projectAddConstruct } from '../../../actions/projects';
import {
  blockCreate,
  blockAddComponent,
  blockClone,
  blockRename,
} from '../../../actions/blocks';
import { focusConstruct, focusBlocks } from '../../../actions/focus';
import { projectGetVersion } from '../../../selectors/projects';
import DnD from '../dnd/dnd';
import ConstructViewer from './constructviewer';
import MouseTrap from '../mousetrap';

import '../../../styles/constructviewercanvas.css';

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
    this.props.blockRename(construct.id, 'New Construct');
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
    // edge threshold for autoscrolling
    const edge = 150;
    // monitor drag overs to autoscroll the canvas when the mouse is near top or bottom
    DnD.registerMonitor(ReactDOM.findDOMNode(this), {
      monitorOver: (globalPosition) => {
        const local = this.mouseTrap.globalToLocal(globalPosition, ReactDOM.findDOMNode(this));
        const box = this.mouseTrap.element.getBoundingClientRect();
        if (local.y < edge) {
          this.autoScroll(-1);
        } else {
          if (local.y > box.height - edge) {
            this.autoScroll(1);
          } else {
            // cancel the autoscroll
            this.autoScroll(0);
          }
        }
      },
      monitorEnter: () => {},
      monitorLeave: () => {
        this.autoScroll(0);
      },

    });


    // drop target drag and drop handlers
    DnD.registerTarget(ReactDOM.findDOMNode(this.refs.dropTarget), {
      drop: this.onDrop.bind(this),
      dragEnter: () => {
        React.findDOMNode(this.refs.dropTarget).classList.add('cvc-hovered');
      },
      dragLeave: () => {
        React.findDOMNode(this.refs.dropTarget).classList.remove('cvc-hovered');
      },
      zorder: -1,
    });

    // mouse trap is used for coordinate transformation
    this.mouseTrap = new MouseTrap({
      element: ReactDOM.findDOMNode(this),
    });
  }

  /**
   * unregister DND handlers
   */
  componentWillUnmount() {
    DnD.unregisterTarget(ReactDOM.findDOMNode(this.refs.dropTarget));
    Dnd.unregisterMonitor(ReactDOM.findDOMNode(this));
    this.mouseTrap.dispose();
    this.mouseTrap = null;
  }

  /**
   * auto scroll in the given direction -1, towards top, 0 stop, 1 downwards.
   */
  autoScroll(direction) {
    invariant(direction >= -1 && direction <= 1, 'bad direction -1 ... +1');
    this.autoScrollDirection = direction;

    // we need a bound version of this.autoScrollUpdate to use for animation callback to avoid
    // creating a closure at 60fps
    if (!this.autoScrollBound) {
      this.autoScrollBound = this.autoScrollUpdate.bind(this)
    }
    // cancel animation if direction is zero
    if (this.autoScrollDirection === 0) {
      if (this.autoScrollRequest) {
        window.cancelAnimationFrame(this.autoScrollRequest);
        this.autoScrollRequest = 0;
      }
    } else {
      // setup animation callback as required
      if (!this.autoScrollRequest) {
        this.autoScrollRequest = window.requestAnimationFrame(this.autoScrollBound);
      }
    }
  }
  autoScrollUpdate() {
    invariant(this.autoScrollDirection === -1 || this.autoScrollDirection === 1, 'bad direction for autoscroll');
    const el = ReactDOM.findDOMNode(this)
    el.scrollTop += this.autoScrollDirection * 20;
    // start a new request unless the direction has changed to zero
    this.autoScrollRequest = this.autoScrollDirection ? window.requestAnimationFrame(this.autoScrollBound) : 0;
  }

  /**
   * clicking on canvas unselects all blocks
   */
  onClick = (evt) => {
    if (evt.target === React.findDOMNode(this)) {
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
      <div className="cvc-drop-target" ref="dropTarget">Drop blocks here to create a new construct.</div>
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
  blockRename,
  blockAddComponent,
  projectGetVersion,
  blockCreate,
  blockClone,
})(ConstructViewerCanvas);
