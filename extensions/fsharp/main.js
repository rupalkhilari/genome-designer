import React from 'react';
import ReactDOM from 'react-dom';

const manifest = require('json!./package.json');


class FSCompilerUI extends React.Component {

  sendToServer() {
    console.log("Send code to the server");
  }

  render() {
    var textCodeStyle = {
      width: '50%',
      height: '80%'
    };
    var textResultStyle = {
      width: '50%',
      height: '80%'
    };
    var divStyle = {
      width: '100%',
      height: '100%'
    };

    return(
      <div style={divStyle}>
        <textarea style={textCodeStyle} placeholder="F# code here" />
        <textarea style={textResultStyle} placeholder="Results here" readOnly/>
        <input type="button" value="Compile" onClick={this.sendToServer.bind(this)}/>
        <input type="button" value="Clear"/>
      </div>
    );
  };
}

function render(container, options) {
  //container.innerHTML = 'Testing the fsharp compiler';
  ReactDOM.render(<FSCompilerUI/>, container);

  //throw an error for debugging
  //require('./externalFile.js').doBadThing();
}

window.gd.registerExtension(manifest, render);