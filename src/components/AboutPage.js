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

// we dont really need to inject anything from redux here, so just inject the dispatch function by calling connect() alone.
// otherwise, we would choose which reducers we wanted to pass in explicitly so that the component would re-render when those stores change
// https://github.com/rackt/react-redux/blob/master/docs/api.md#api
export default connect()(AboutPage);
