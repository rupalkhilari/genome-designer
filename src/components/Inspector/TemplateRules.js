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
import { blockMerge } from '../../actions/blocks';

import '../../styles/ListOptions.css';

export class TemplateRules extends Component {
  static propTypes = {
    block: PropTypes.object.isRequired,
    blockMerge: PropTypes.func.isRequired,
    isConstruct: PropTypes.bool.isRequired,
  };

  render() {
    return (
      <p>(Todo - set frozen, list, hidden){this.props.isConstruct && ' [construct]'}</p>
    );
  }
}

const mapStateToProps = (state, props) => ({});

export default connect(mapStateToProps, {
  blockMerge,
})(TemplateRules);
