import React, { Component, PropTypes } from 'react';
import PopupMenu from '../../components/Menu/PopupMenu';
import Vector2D from '../../containers/graphics/geometry/vector2d';
import ReactDOM from 'react-dom';

import '../../../src/styles/ordermodal.css';

export default class Selector extends Component {
  static propTypes = {
    options: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.any,
    disabled: PropTypes.bool.isRequired,
  };

  state = {
    menuOpen: false,
    menuPosition: new Vector2D(),
  }

  onClick = () => {

  }

  onShowMenu = () => {
    const box = ReactDOM.findDOMNode(this).getBoundingClientRect();
    this.setState({
      menuOpen: true,
      menuPosition: new Vector2D(box.left, box.top + box.height),
    });
  }

  closeMenu = () => {
    this.setState({
      menuOpen: false,
    });
  }

  render() {

    return (
      <div>
        <div
            className="dropdown"
            onClick={this.onShowMenu}
          >Selector&nbsp;&#x2193;
          <PopupMenu
            open={this.state.menuOpen}
            menuItems={this.props.options}
            position={this.state.menuPosition}
            closePopup={this.closeMenu}
          />
        </div>
      </div>
    );
  }
  // render() {
  //   const options = this.props.options.map(option => {
  //     return (
  //       <option value={option.value}
  //               key={option.label}>
  //         {option.label}
  //       </option>
  //     );
  //   });
  //
  //   return (
  //     <select onChange={evt => {this.props.onChange(evt.target.value)}}
  //             defaultValue={this.props.value}
  //             disabled={this.props.disabled}>
  //       {this.props.disabled ? null : options}
  //     </select>
  //   );
  // }
}
