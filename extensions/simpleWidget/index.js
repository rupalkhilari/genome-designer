function render(container, options) {
  container.innerHTML = 'extension loaded!';

  var subscriber = window.constructor.store.subscribe(function storeSubscription(state, lastAction) {
    console.log(lastAction.type);
  });
}

window.constructor.registerExtension('simpleWidget', render);
