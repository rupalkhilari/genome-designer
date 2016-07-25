
function render(container, options) {
  container.innerHTML = '<div style="width:100%;height:100%;background-color:dodgerblue"></div>';

  var subscriber = window.constructor.store.subscribe(function storeSubscription(state, lastAction) {
    console.log('ACTION: ', lastAction.type);
    switch (lastAction.type) {
      case 'FOCUS_BLOCKS':
        console.log(lastAction.blockIds.toString());
      break;
    }
  });
  return subscriber;
}


// bind this extension, by name, to its render function
window.constructor.extensions.register('sequence-viewer', render);
