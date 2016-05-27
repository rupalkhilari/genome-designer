import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import SceneGraph2D from '../../containers/graphics/scenegraph2d/scenegraph2d';
import Layout from '../../containers/graphics/views/layout';

import '../../../src/styles/ordermodal.css';
import '../../../src/styles/SceneGraphPage.css';

class ConstructPreview extends Component {

  static propTypes = {

  };

  constructor() {
    super();
    this.state = {
      index: 1,
    };
  }
  get dom() {
    return ReactDOM.findDOMNode(this);
  }
  get sceneGraphEl() {
    return this.dom.querySelector('.scenegraph');
  }
  /**
   * construct scene graph and layout once mounted
   * @return {[type]} [description]
   */
  componentDidMount() {
    // create the scene graph we are going to use to display the construct
    this.sg = new SceneGraph2D({
      width: this.dom.clientWidth,
      height: this.dom.clientHeight,
      availableWidth: this.dom.clientWidth,
      availableHeight: this.dom.clientHeight,
      parent: this.sceneGraphEl,
    });
    // create the layout object
    this.layout = new Layout(this, this.sg, {
      showHeader: false,
      insetX: 10,
      insetY: 10,
    });
  }

  componentDidUpdate() {
    if (this.props.constructs.length) {
      this.layout.update({
        construct: this.props.constructs[this.state.index-1],
        blocks: this.props.blocks,
        currentBlocks: [],
        currentConstructId: this.props.constructs[this.state.index-1],
      });
      this.sg.update();
    }
  }
  onChangeConstruct = (evt) => {
    const index = parseInt(evt.target.value);
    this.setState({index});
  }

  render() {
    const label = `of ${this.props.constructs.length} combinations`;
    return (
      <div className="preview">
        <input
          className="input-updown"
          type="number"
          defaultValue="1"
          min="1"
          max={this.props.constructs.length}
          onChange={this.onChangeConstruct}
          />
        <label>{label}</label>
        <div className="container">
          <div className="scenegraph"></div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state, ownProps) {
  // get first project for now and its constructs
  let project = null;
  Object.keys(state.projects).forEach(key => {
    if (key.startsWith('project-') && !project) {
      project = state.projects[key];
    }
  });
  if (project) {
    // get constructs from project
    const constructs = project.components.map(componentId => state.blocks[componentId]);
    return {
      blocks: state.blocks,
      project,
      constructs,
    };
  } else {
    return {
      blocks: state.blocks,
      constructs: [],
    }
  }
}
export default connect(mapStateToProps, {
})(ConstructPreview);
