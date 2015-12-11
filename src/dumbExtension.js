import React from 'react';
import { render as reactRender } from 'react-dom';

class SimpleComponent extends React.Component {
  componentWillMount() {
    this.setState({
      rendered: Date.now(),
    });
  }

  render() {
    return (
      <p>Rendered at {new Date(this.state.rendered).toUTCString()}</p>
    );
  }
}

const render = (container) => {
  reactRender(<SimpleComponent />, container);
};

const manifest = {
  id: 'onion-0.0.0',
  name: 'onion',
  render,
};

window.gd.registerExtension('sequenceDetail', manifest);