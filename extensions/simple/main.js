var manifest = require('json!./package.json');

function render(container) {
  container.innerHTML = 'extension loaded!';
}

window.gd.registerExtension(manifest, render);
