var manifest = {
  "name": "hello",
  "version": "1.0.0",
  "description": "Hello world",
  "region": "sequenceDetail",
  "readable": "Hello World"
};

function render(container, options) {
  container.innerHTML = 'Hello World';

  console.log(options.boundingBox);

  //throw an error for debugging debugging
  //require('./externalFile.js').doBadThing();

  var subscriber = window.gd.store.subscribe(function (state, lastAction) {
    var last = [];
    var current = state.focus.blockIds;
    if (current &&
      current.length &&
        (current.length !== last.length ||
        !current.every(function (item, index) {return item !== last[index]}))
    ) {

      var block = state.blocks[current[0]];
      block.getSequence().then(function (sequence) {
        console.log(sequence);
      });

      console.log(current);
      last = current;
    }
  });
}

window.gd.registerExtension(manifest, render);