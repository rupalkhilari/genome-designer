import React from 'react';
import ReactDOM from 'react-dom';
import CompilerLayout from './components/CompilerLayout';

const manifest = require('json!./package.json');


// Attaches to the sequenceDetail region.
function render(container, options) {
  ReactDOM.render(<CompilerLayout/>, container);
}

window.gd.registerExtension(manifest, render);
