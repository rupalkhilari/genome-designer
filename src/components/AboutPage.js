import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

export class AboutPage extends Component {
  constructor (props) {
    super(props);
  }

  static propTypes = {}

  state = {
    counter: +Date.now()
  }

  componentDidMount () {
    this.interval = setInterval(() => {
      this.setState({
        counter: this.state.counter + 1000
      });
    }, 1000);
  }

  componentWillUnmount () {
    clearInterval(this.interval);
  }

  render () {
    return (
      <div>
        <h1>This is our About Page</h1>
        <p style={{color: 'red'}}>{(new Date(this.state.counter)).toUTCString()}</p>
      </div>
    );
  }
}

//export default connect()(AboutPage);
