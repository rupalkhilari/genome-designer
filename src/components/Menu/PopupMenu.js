import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react';

import MenuItem from './MenuItem';
import MenuSeparator from './MenuSeparator';

// style for visible wrapper
const visible = {
  position: 'fixed',
  width: '100vw',
  height: '100vh',
  left: 0,
  top: 0,
  backgroundColor: 'rgba(255,0,0,0.25)',
  zIndex: 100000,
};
// style for hidden wrapper
const hidden = {
  position: 'fixed',
  top: 0,
  width: 0,
  left: '-10000px',
  display: 'none',
  visibility: 'hidden',
  overflow: 'hidden',
};

export default class Menu extends Component {

  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    menuItems: PropTypes.array.isRequired,
  }

  // mouse down on the blocker closes the modal
  onMouseDown(e) {
    const blockEl = ReactDOM.findDOMNode(this.refs.blocker);
    if (e.target === blockEl) {
      alert('Close!');
    }
  }

  render() {

    // set visible or hidden style
    //let style = this.props.open ? visible : hidden;
    const style = visible;
    const child = {
      position: 'absolute',
      left: '200px',
      top: '400px',
      width: '100px',
      height: '200px',
      backgroundColor: 'whitesmoke'
    }
    return (
      <div
        onMouseDown={this.onMouseDown.bind(this)}
        style={style}
        ref="blocker"
      >
        <div className="menu-popup-container">
          {this.props.menuItems.map(item => {
            const boundAction = () => {
              item.action();
              this.toggle(false);
            };
            return (
              item.text ?
                (<MenuItem text={item.text} action={boundAction}/>) :
                (<MenuSeparator />)
              );
          })}
        </div>
      </div>
    );
  }
}
