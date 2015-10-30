import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';

import ProjectSelect from '../components/ProjectSelect';

import styles from '../styles/GlobalNav.css';
import withStyles from '../decorators/withStyles';

@withStyles(styles)
class GlobalNav extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    pushState: PropTypes.func.isRequired,
    inputValue: PropTypes.string.isRequired,
  }

  handleChange = (nextValue) => {
    this.props.pushState(null, `/project/${nextValue}`);
  }

  render() {
    return (
      <div className="GlobalNav">
        <span className="GlobalNav-title">Global Nav</span>
        <ProjectSelect value={this.props.inputValue}
                       onChange={this.handleChange} />

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
})(GlobalNav);
