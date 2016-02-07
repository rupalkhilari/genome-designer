var manifest = require('json!./package.json');

function render(container) {
  container.innerHTML = 'extension loaded!';

  var subscriber = window.gd.store.subscribe(function (state, lastAction) {
    console.log(state);
  });
}

window.gd.registerExtension(manifest, render);
