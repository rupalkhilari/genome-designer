import React, { Component, PropTypes } from 'react';
import brace from 'brace';
import AceEditor from 'react-ace';

import '../mode/fsharptest';
import 'brace/theme/monokai';

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
      height: '250px',
      display: 'inline-block',
    };
    // Find a better way to do this since it is definitely one
    return (
        <div style={textCodeStyle}>
          <AceEditor mode="ocaml"
                     theme="monokai"
                     name="aceEditor"
                     editorProps={{$blockScrolling: true}}
                     width="400px"
                     maxLines={16}
                     minLines={16}
                     showPrintMargin={false}
                     value={this.props.value}
                     onChange={this.handleChange}/>
          </div>
    );
  }
}

