import React, { Component, PropTypes } from 'react';

export default class Permutations extends Component {

  static propTypes = {
    total: PropTypes.number.isRequired,
    value: PropTypes.number,
    editable: PropTypes.bool.isRequired,
    onBlur: PropTypes.func.isRequired,
  };

  constructor() {
    super();
    this.state = {
      value: 1,
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({value: nextProps.value});
  }

  onBlur = () => {
    let value = parseInt(this.state.value);
    if (value < 1) {
      value = 1;
      this.setState({value});
    }
    if (isNaN(value) || value > this.props.total) {
      value = this.props.total;
      this.setState({value});
    }
    this.props.onBlur(value);
  }

  onChange = (evt) => {
    this.setState({
      value: evt.target.value,
    });
  }

  render() {
    // if editable show input + permutations
    if (this.props.editable) {
      return (
        <div className="permutations">
          <input
            onChange={this.onChange}
            value={this.state.value}
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
