import React, { Component, PropTypes } from 'react';
import CodeMirror from 'react-codemirror';
require('codemirror/mode/javascript/javascript');

// Code editor
export default class CodeEditorCodeMirror extends Component {

  render() {
    const textCodeStyle = {
      width: '100%',
      height: '250px',
      display: 'inline-block',
    };
    // Find a better way to do this since it is definitely one
    return (

          <CodeMirror value="Testing this value" options={{mode: 'javascript'}}/>
    );
  }
}
