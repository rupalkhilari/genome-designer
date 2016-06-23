import React, { Component, PropTypes } from 'react';

export default class Permutations extends Component {

  static propTypes = {
    total: PropTypes.number.isRequired,
    value: PropTypes.number,
    editable: PropTypes.bool.isRequired,
    onBlur: PropTypes.func.isRequired,
  };

  onBlur = (evt) => {
    let value = parseInt(evt.target.value);
    if (isNaN(value) || value < 1 || value > this.props.total) {
      value = 1;
    }
    this.props.onBlur(value);
  }

  render() {
    // if editable show input + permutations
    if (this.props.editable) {
      return (
        <div className="permutations">
          <input
            defaultValue={this.props.value}
            onBlur={this.onBlur}
          />
          <span> of <b>{this.props.total} </b>possibilities</span>
        </div>
      )
    } else {
      // if non editable show permutations
      return (
        <div>
          <span><b>{this.props.total} </b>possibilities</span>
        </div>
      )
    }
  }
}
