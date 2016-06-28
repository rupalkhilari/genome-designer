import React, { Component } from 'react';
import CodeEditor from './CodeEditor';
import ResultViewer from './ResultViewer';
import CodeEditorAce from './CodeEditorAce';
import CodeEditorCodeMirror from './CodeEditorCodeMirror';
import StatusBar from './StatusBar';
import SelectViewEditor from './SelectViewEditor';

import { sendToCompile } from '../code';

// Integrated Code compiler UI
export default class CompilerLayout extends Component {


  constructor(props) {
    super(props);
    this.state = {
      editorcontent: '',
      resultcontent: '',
      statusmessage: '',
      editorType: '1',
    };
  }

  onEditorContentChange = (content) => {
    this.setState({ editorcontent: content });
  };

  handleSubmit = (e) => {
    // send the code to the server.
    console.log(`Sending code to the server:

    ${this.state.editorcontent}`);
    this.setState({ statusmessage: 'Running code...'});

    sendToCompile(this.state.editorcontent).then((data) => {
      this.setState({ resultcontent: data.result });
      this.setState({ statusmessage: 'Program exited with status code: ' + data.status });
    });
  };

  clearContents = () => {
    this.setState({
      editorcontent: '',
      resultcontent: '',
      statusmessage: '',
    });
  };

  onEditorTypeChange = (newValue) => {
    this.setState( { editorType: newValue });
  };

  onSave = () => {
    console.log("Save the snippet");
  }
  //
  render() {
    const divStyle = {
      width: '100%',
      height: '100%',
    };

    const buttonStyle = {
      padding: '5px 5px 5px 5px',
      margin: '5px 2px 5px 2px',
      size: '20em',
    }
    let editorComponent;
    switch (this.state.editorType) {
      case '1':
        // change to plain text editor
        editorComponent = <CodeEditor callbackParent={this.onEditorContentChange} value={this.state.editorcontent}/>;
        break;
      case '2':
        // change to ace editor
        editorComponent = <CodeEditorAce callbackParent={this.onEditorContentChange} value={this.state.editorcontent}/>
        break;
      case '3':
        // change to code-mirror
          editorComponent = <CodeEditorCodeMirror/>
        break;
      default:
        // change to 1
        // could not identify the editor value
        break;
    }
    return (
        <div style={divStyle}>
          <table width="100%" height="100%">
            <tbody>
            <tr>
              <td width="400px">
                <input type="button"
                       value="Run"
                       onClick={this.handleSubmit}
                       style={ buttonStyle } />
                <input type="button"
                       value="Clear"
                       onClick={this.clearContents}
                       style={ buttonStyle } />
                <input type="button"
                       value="Save"
                       onClick={this.saveContents}
                       style={ buttonStyle } />
                Choose your editor:
                <SelectViewEditor onChangeCallback={this.onEditorTypeChange} />
              </td>
              <td></td></tr>
            <tr>
              <td>
                { editorComponent }
              </td>
              <td>
              <ResultViewer resultContent={this.state.resultcontent}/>
              </td>
            </tr>
            <tr>
              <td>
                <StatusBar title="statusbar" statusMessage={this.state.statusmessage}/>
              </td>
              <td></td>
            </tr>
            </tbody>
          </table>
        </div>
    );
  }
}
//  <CodeEditorAce callbackParent={this.onEditorContentChange} />
// <CodeEditor callbackParent={this.onEditorContentChange}/>
//  <CodeEditorAce callbackParent={this.onEditorContentChange} value={this.state.editorcontent}/>