var manifest = require('json!./package.json');

function render(container) {
  container.innerHTML = 'extension loaded!';

  //throw an error for debugging debugging
  //require('./externalFile.js').doBadThing();

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
