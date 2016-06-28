import React, {Component, PropTypes} from 'react';


export default class StatusBar extends Component {
  static propTypes = {
    title: React.PropTypes.string,
    statusMessage: React.PropTypes.string,
  }

  static defaultProps = {
    title: 'Block',
    statusMessage: '',
  }

  render() {
    return (
        <div style={{ verticalAlign: 'bottom' }}>
          <input type="text"
                 style={{
                  width: '100%',
                  borderStyle: 'none none none none'
                 }}
                 value={this.props.statusMessage}
                 readOnly
          />
        </div>
    );
  }
}
