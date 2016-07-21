function simpleStoreSubscription(state, lastAction) {
  console.log(lastAction, state);
}

var subscriber = window.constructor.store.subscribe(simpleStoreSubscription);

//later, when you are done, to stop listening...
//subscriber()