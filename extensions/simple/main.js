var manifest = require('json!./package.json');
var external = require('./externalFile.js');

function render(container) {
  container.innerHTML = 'extension loaded!';

  external.doBadThing();

  var subscriber = window.gd.store.subscribe(function (state, lastAction) {
    var last = [];
    var current = state.ui.currentBlocks;
    if (current &&
      current.length &&
        (current.length !== last.length ||
        !current.every(function (item, index) {return item !== last[index]}))
    ) {
      console.log(current);
      last = current;
    }
  });


}

window.gd.registerExtension(manifest, render);
