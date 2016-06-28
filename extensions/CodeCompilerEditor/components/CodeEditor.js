import React, { Component, PropTypes } from 'react';

// Code editor
export default class CodeEditor extends Component {

  static propTypes = {
    callbackParent: PropTypes.func.isRequired,
    value: PropTypes.string,
  };
  handleChange = (e) => {
    this.props.callbackParent(e.target.value);
  };

  render() {
    const textCodeStyle = {
      width: '100%',
      height: '250px',
      display: 'inline-block',
      padding: '10px 0px 5px 10px',
    };
    // Find a better way to do this since it is definitely one.
    return (
        <textarea id="editor"
                  style={textCodeStyle}
                  placeholder="F# code here"
                  onChange={this.handleChange}
                  value={this.props.value}
        />
    );
  }
}

