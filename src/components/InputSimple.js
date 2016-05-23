import React, { Component, PropTypes } from 'react';

import '../styles/InputSimple.css';

export default class InputSimple extends Component {
  static propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    readOnly: PropTypes.bool,
    default: PropTypes.string,
    updateOnBlur: PropTypes.bool,
    useTextarea: PropTypes.bool,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onEscape: PropTypes.func,
    maxLength: PropTypes.number,
  };

  static defaultProps = {
    onFocus: () => {},
    onBlur: () => {},
    onEscape: () => {},
    maxLength: 4096,
  };

  constructor(props) {
    super();

    //we need to maintain state internally so we do not need to update on all changes
    this.state = {
      value: props.value,
    };
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
    if (nextProps.value !== this.props.value) {
      this.setState({ value: nextProps.value });
    }
  }

  handleFocus = (event) => {
    this.props.onFocus(event);
  };

  //todo - should probably handle window blur e.g. so transactions dont hang
  handleBlur = (event) => {
    console.log('blur!!', event.target.value);
    if (this.props.updateOnBlur) {
      this.handleSubmission(event);
    }
    this.props.onBlur(event);
  };

  handleKeyUp = (event) => {
    if (this.props.readOnly) {
      event.preventDefault();
      return;
    }
    //escape
    if (event.keyCode === 27) {
      this.props.onEscape(event);
      this.refs.input.blur();
      return;
    }
    //enter
    if (event.keyCode === 13 || !this.props.updateOnBlur) {
      this.handleSubmission(event);
    }
  };

  handleSubmission = (event) => {
    if (!this.props.readOnly) {
      this.props.onChange(event.target.value);
    }
  };

  handleChange = (event) => {
    this.setState({ value: event.target.value });

    if (!this.props.updateOnBlur) {
      this.handleSubmission(event);
    }
  };

  render() {
    return (
      <div className={'InputSimple' +
      (this.props.readOnly ? ' readOnly' : '')}>
        {(this.props.useTextarea) &&
        <textarea
          ref="input"
          rows="5"
          value={this.state.value}
          maxLength={this.props.maxLength}
          className="InputSimple-input"
          disabled={this.props.readOnly}
          placeholder={this.props.placeholder}
          onChange={this.handleChange}
          onBlur={this.handleBlur}
          onFocus={this.handleFocus}
          onKeyUp={this.handleKeyUp}/>
        }
        {(!this.props.useTextarea) &&
        <input
          size="30"
          ref="input"
          value={this.state.value}
          maxLength={this.props.maxLength}
          disabled={this.props.readOnly}
          className="InputSimple-input"
          placeholder={this.props.placeholder}
          onChange={this.handleChange}
          onBlur={this.handleBlur}
          onFocus={this.handleFocus}
          onKeyUp={this.handleKeyUp}/>
        }
      </div>
    );
  }
}
