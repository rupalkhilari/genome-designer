Client Extensions

## Registering an Extensions

### Example

```javascript
const extensionKey = 'myExtension'; //matches name in package.json
const render = (container, options) => {
    //control the container
    container.innerHTML = '<p>yay</p>';

    //API subscription
    const listener = window.constructor.store.subscribe(function changeHandler() {
        //store listener
    });

    //return a function to call when the component unmounts to perform cleanup
    return listener;
}
window.constructor.registerExtension(extensionKey, render);
```

### render()

Arguments are container and options

Options include:

```
boundingBox - boundingRect of container element
```

Can pass an unregister() callback (e.g. to clean up listeners)