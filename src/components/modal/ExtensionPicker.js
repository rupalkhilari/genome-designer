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
import ModalWindow from './modalwindow';
import { uiShowExtensionPicker } from '../../actions/ui';

export class ExtensionPicker extends Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    uiShowExtensionPicker: PropTypes.func.isRequired,
  };

  render() {
    // no render when not open
    if (!this.props.open) {
      return null;
    }

    //todo - list of extensions and toggle (set on close)
    //reload extensions when config changes

    return (
      <ModalWindow
        open={this.props.open}
        title="Extensions"
        closeModal={() => this.props.uiShowExtensionPicker(false)}
        payload={(
          <div style={{ padding: '1rem 2em 3rem', width: '60rem' }}
               className="gd-form">
            <div className="title">Extensions</div>
          </div>
        )}/>
    );
  }
}

function mapStateToProps(state) {
  return {
    open: state.ui.modals.showExtensionPicker,
  };
}

export default connect(mapStateToProps, {
  uiShowExtensionPicker,
})(ExtensionPicker);
