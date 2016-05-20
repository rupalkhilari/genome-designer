import React, {Component, PropTypes} from 'react';

import '../styles/InputSimple.css';

export default class InputSimple extends Component {
  static propTypes = {
    placeholder: PropTypes.string,
    readOnly: PropTypes.bool,
    default: PropTypes.string,
    updateOnBlur: PropTypes.bool,
    useTextarea: PropTypes.bool,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onEscape: PropTypes.func,
    maxLength: PropTypes.number,
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value) {
      this.setInputValue(nextProps.value);
    }
  }

  getInputValue() {
    return this.refs.input.value;
  }

  setInputValue(val) {
    // Generally mutating DOM is a bad idea in React components,
    // but doing this for a single uncontrolled field is less fuss
    // than making it controlled and maintaining a state for it.
    this.refs.input.value = val;
  }

  handleFocus = (event) => {
    this.props.onFocus && this.props.onFocus(event);
  };

  handleBlur = (event) => {
    if (this.props.updateOnBlur) {
      this.handleSubmission();
    }
    this.props.onBlur && this.props.onBlur(event);
  };

  handleKeyUp = (event) => {
    if (this.props.readOnly) {
      //todo - shouldn't change the value
      event.preventDefault();
      return;
    }
    //escape
    if (event.keyCode === 27) {
      this.props.onEscape && this.props.onEscape();
      this.refs.input.blur();
      return;
    }
    //enter
    if (event.keyCode === 13 || !this.props.updateOnBlur) {
      this.handleSubmission();
    }
  };

  handleSubmission = (event) => {
    if (!this.props.readOnly) {
      this.props.onChange(this.getInputValue());
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
          maxLength={this.props.maxLength || 4096}
          className="InputSimple-input"
          disabled={this.props.readOnly}
          placeholder={this.props.placeholder}
          defaultValue={this.props.value || this.props.default}
          onBlur={this.handleBlur}
          onFocus={this.handleFocus}
          onKeyUp={this.handleKeyUp}/>
        }
        {(!this.props.useTextarea) &&
        <input
          size="30"
          ref="input"
          maxLength={this.props.maxLength || 4096}
          disabled={this.props.readOnly}
          className="InputSimple-input"
          placeholder={this.props.placeholder}
          defaultValue={this.props.value || this.props.default}
          onBlur={this.handleBlur}
          onFocus={this.handleFocus}
          onKeyUp={this.handleKeyUp}/>
        }
      </div>
    );
  }
}
