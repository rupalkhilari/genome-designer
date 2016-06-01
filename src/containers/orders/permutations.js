import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import '../../../src/styles/ordermodal.css';

class Permutations extends Component {

  static propTypes = {
    total: PropTypes.number.isRequired,
    value: PropTypes.number,
    editable: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  render() {
    // if editable show input + permutations
    if (this.props.editable) {
      return (
        <div>
          <input
            className="permutations-input"
            type="number"
            defaultValue={this.props.value}
            min="1"
            max={this.props.total}
            onChange={evt => {
              this.props.onChange(evt.target.value);
            }} defaultValue={this.props.value}
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

function mapStateToProps(state) {
  return {
  };
}

export default connect(mapStateToProps, {
})(Permutations);
