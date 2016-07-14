//in a more complex project using a build system, you could simply include package.json here and define your fields there
var manifest = {
  "name": "simple",
  "version": "1.0.0",
  "description": "Simple Genetic Construct Extension Example",
  "region": null
};

function render() {
  var subscriber = window.gd.store.subscribe(function simpleStoreSubscription(state, lastAction) {
    console.log(lastAction, state);
  });
}

window.gd.registerExtension(manifest, render);
