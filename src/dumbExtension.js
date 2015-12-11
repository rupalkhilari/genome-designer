import React from 'react';
import { render as reactRender } from 'react-dom';

/* create simple component */

class SimpleComponent extends React.Component {
  componentWillMount() {
    const self = this;
    let lastBlock;

    this.setState({
      block: null,
      rendered: Date.now(),
    });

    const storeSubscriber = (store) => {
      const { currentInstance } = store.ui;
      const block = !!currentInstance ? store.blocks[currentInstance] : null;

      // all instances in the store are immutables, so you can just do a reference equality check to see if it has changed
      // this would also be a good place to convert to the onion format
      // it would be a great place to memoize
      // (i.e. return same value if input === previous input, rather than storing it explicitly in the component,
      // and then you can reuse the selector for all things you retrieve from the store)
      if (block !== lastBlock) {
        //note that right now, blocks dont have a sequence... this will work but nothing will be returned
        block.getSequence()
          .then(sequence => {
            self.setState({
              block,
              sequence,
            });
          });
        lastBlock = block;
      }
    };

    this.subscriber = window.gd.store.subscribe(storeSubscriber);
  }

  componentWillUnmount() {
    this.subscriber();
  }

  render() {
    return (
      <div>
        <p>Rendered at {new Date(this.state.rendered).toUTCString()}</p>

        {this.state.block && (
          <div>
            <p>block: {this.state.block.metadata.name}</p>
            <p>sequence: {this.state.sequence}</p>
          </div>
        )}

      </div>
    );
  }
}

/* register with store */
//note that if you were using redux, you could wrap your component in a Provider, and pass in window.gd.store
//we'll just register directly for this example

/* rendering + registering extension */

const render = (container) => {
  reactRender(<SimpleComponent />, container);
};

const manifest = {
  id: 'onion-0.0.0',
  name: 'onion',
  render,
};

window.gd.registerExtension('sequenceDetail', manifest);
