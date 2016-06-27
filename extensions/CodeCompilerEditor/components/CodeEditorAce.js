import React, { Component, PropTypes } from 'react';
import brace from 'brace';
import AceEditor from 'react-ace';

import 'brace/mode/java';
import 'brace/theme/github';

// Code editor
export default class CodeEditorAce extends Component {


  static propTypes = {
    callbackParent: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
  };

  static defaultProps = {
    value: '',
  };

  // This editor seems to be returning the content of the editor rather than the event
  handleChange = (e) => {
    //this.props.callbackParent(e.target.value);
    //this.props.callbackParent(e);

    this.props.callbackParent(e);
  };

  render() {
    const textCodeStyle = {
      width: '100%',
      height: '80%',
    };
    // Find a better way to do this since it is definitely one.
    return (
        <div style={textCodeStyle}>
          <AceEditor mode="java"
                     theme="github"
                     name="aceEditor"
                     editorProps={{$blockScrolling: true}}
                     width="500"
                     maxLines="15"
                     minLines="15"
                     showPrintMargin="false"
                   value={this.props.value}
                   onChange={this.handleChange}/>
          </div>
    );
  }
}

