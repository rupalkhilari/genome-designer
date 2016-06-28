import React, {Component, PropTypes} from 'react';


export default class SelectViewEditor extends Component {
  static propTypes = {
    optionId: React.PropTypes.string,
    onChangeCallback: React.PropTypes.func,
  }

  static defaultProps = {
    optionId: '1',
  }

  changeEditor = (e) => {
    this.props.onChangeCallback(e.target.value);
  }
  render() {
    const selectStyle = {
      padding: '5px 5px 5px 5px',
      margin: '5px 2px 5px 2px',
    }
    return (
          <select defaultValue="1" onChange={this.changeEditor} style={selectStyle}>
            <option value="1" label="Plain text"/>
            <option value="2" label="Ace" />
            <option value="3" label="Code-mirror"/>
          </select>
    );
  }
}
