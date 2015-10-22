import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';
import ProjectSelect from '../components/ProjectSelect';
import { resetErrorMessage } from '../actions';

class App extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    pushState: PropTypes.func.isRequired, //defined for dispatch actions, see below
    inputValue: PropTypes.string.isRequired, //defined in mapStateToProps, see below

    // Injected by React Router
    children: PropTypes.node
  }

  handleChange = (nextValue) => {
    this.props.pushState(null, `/project/${nextValue}`);
  }

  render() {
    const { children } = this.props;
    return (
      <div>
        <ProjectSelect value={this.props.inputValue}
                       onChange={this.handleChange} />
        {children}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    inputValue: state.router.params.projectId || ''
  };
}

export default connect(mapStateToProps, {
  pushState
})(App);
