import React, { Component, PropTypes } from 'react';

// Results Viewer
export default class ResultViewer extends Component {
  static propTypes = {
    resultContent: PropTypes.string,
  };

  static defaultProps = {
    resultContent: '',
  };

  setResults = (data) => {
    console.log('setting!');
    console.log(data);
  };

  render() {
    const textResultStyle = {
      width: '100%',
      height: '250px',
      display: 'inline-block',
    };

    return (
        <textarea id="viewer"
                  style={textResultStyle}
                  placeholder="Results here"
                  value={this.props.resultContent}
                  readOnly/>
    );
  }
}
