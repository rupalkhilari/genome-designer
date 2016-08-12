/*
Copyright 2016 Autodesk,Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

class RouteWrapper extends Component {
  static propTypes = {
    user: PropTypes.object,
    children: PropTypes.object,
  };

  render() {
    if (!!this.props.user.userid) {
      return React.Children.only(this.props.children);
    }

    if (process.env.NODE_ENV !== 'production') {
      //console.log('no user for RouteWrapper');
    }

    return null;
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

export default connect(mapStateToProps)(RouteWrapper);
