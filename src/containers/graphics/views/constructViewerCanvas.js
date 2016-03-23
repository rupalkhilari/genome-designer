import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { uiSetCurrent } from '../../../actions/ui';

export class ConstructViewerCanvas extends Component {

  static propTypes = {

  };

  constructor(props) {
    super(props);
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
    return (<div className="ProjectPage-constructs" onClick={this.onClick}>
      {this.props.children}
    </div>)
  }
}

function mapStateToProps(state, props) {
  return {
  };
}

export default connect(mapStateToProps, {
  uiSetCurrent,
})(ConstructViewerCanvas);
