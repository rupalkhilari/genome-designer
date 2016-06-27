import React, { Component } from 'react';
import CodeEditor from './CodeEditor';
import ResultViewer from './ResultViewer';
import CodeEditorAce from './CodeEditorAce';
import { sendToCompile } from '../code';

// Integrated Code compiler UI
export default class CompilerLayout extends Component {


  constructor(props) {
    super(props);
    this.state = {
      editorcontent: '',
      resultcontent: '',
    };
  }

  onEditorContentChange = (content) => {
    this.setState({ editorcontent: content });
  };

  handleSubmit = (e) => {
    // send the code to the server.
    console.log(`Sending code to the server:

    ${this.state.editorcontent}`);

    sendToCompile(this.state.editorcontent).then((data) => {
      this.setState({ resultcontent: data });
    });
  };

  clearContents = () => {
    this.setState({editorcontent: '', resultcontent: ''});
  };


  //
  render() {
    const divStyle = {
      width: '100%',
      height: '100%',
    };

    return (
        <div style={divStyle}>
          <CodeEditor callbackParent={this.onEditorContentChange} value={this.state.editorcontent}/>
          <ResultViewer resultContent={this.state.resultcontent}/>
          <input type="button" value="Submit" onClick={this.handleSubmit}/>
          <input type="button" value="Clear" onClick={this.clearContents}/>
        </div>
    );
  }
}
//  <CodeEditorAce callbackParent={this.onEditorContentChange} />
// <CodeEditor callbackParent={this.onEditorContentChange}/>
//  <CodeEditorAce callbackParent={this.onEditorContentChange} value={this.state.editorcontent}/>