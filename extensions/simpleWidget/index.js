//in a more complex project using a build system, you could simply include package.json here and define your fields there
var manifest = {
  "name": "linked",
  "version": "1.0.0",
  "description": "Linked Extension",
  "region": "sequenceDetail",
  "readable": "Linked Example"
};

function render(container, options) {
  container.innerHTML = 'extension loaded!';

  var subscriber = window.constructor.store.subscribe(function storeSubscription(state, lastAction) {
    console.log(lastAction.type);
  });
}

window.constructor.registerExtension(manifest, render);
