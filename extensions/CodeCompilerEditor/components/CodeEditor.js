import React, { Component, PropTypes } from 'react';

// Code editor
export default class CodeEditor extends Component {

  static propTypes = {
    callbackParent: PropTypes.func.isRequired,
  };
  handleChange = (e) => {
    this.props.callbackParent(e.target.value);
  };

  render() {
    const textCodeStyle = {
      width: '50%',
      height: '80%',
    };
    // Find a better way to do this since it is definitely one.
    return (
        <textarea id="editor"
                  style={textCodeStyle}
                  placeholder="F# code here"
                  onChange={this.handleChange}/>
    );
  }
}

