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
import { merge } from 'lodash';
import ModalWindow from './modalwindow';
import { uiShowExtensionPicker } from '../../actions/ui';
import { userUpdateConfig } from '../../actions/user';
import loadAllExtensions from '../../extensions/loadExtensions';
import { getExtensionsInfo } from '../../middleware/extensions';
import { extensionName, extensionAuthor, extensionRegion, manifestIsClient, manifestIsServer } from '../../../server/extensions/manifestUtils';

import '../../styles/ExtensionPicker.css';

export class ExtensionPicker extends Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    config: PropTypes.shape({
      extensions: PropTypes.object.isRequired,
    }).isRequired,
    uiShowExtensionPicker: PropTypes.func.isRequired,
    userUpdateConfig: PropTypes.func.isRequired,
  };

  state = {
    dirty: false,
    extensions: {},
    extensionsActive: {},
  };

  componentDidMount() {
    getExtensionsInfo(true)
      .then(extensions => this.setState({ extensions }));
  }

  checkExtensionActive = (extension) => {
    //todo - handle active state not set (extension key not present in config)
    return (typeof this.state.extensionsActive[extension] === 'boolean') ?
      this.state.extensionsActive[extension] :
      this.props.config.extensions[extension].active;
  };

  handleToggleExtension = (extension) => {
    const nextState = !this.checkExtensionActive(extension);

    const extensionsActive = Object.assign({}, this.state.extensionsActive, { [extension]: nextState });
    this.setState({ extensionsActive, dirty: true });
  };

  submitForm = () => {
    this.setState({ dirty: false });

    const mappedExtensionsActive = Object.keys(this.state.extensionsActive).reduce((acc, key) => {
      return Object.assign(acc, { [key]: { active: this.state.extensionsActive[key] } });
    }, {});
    const nextConfig = merge({}, this.props.config, { extensions: mappedExtensionsActive });
    this.props.userUpdateConfig(nextConfig)
      .then(user => {
        loadAllExtensions(true);
        this.props.uiShowExtensionPicker(false);
      });
  };

  render() {
    // no render when not open
    if (!this.props.open) {
      return null;
    }

    const tableFields = ['name', 'author', 'region'];

    //later - we'll probably want to group by region...

    return (
      <ModalWindow
        closeOnClickOutside
        open={this.props.open}
        title="Extensions"
        closeModal={() => this.props.uiShowExtensionPicker(false)}
        payload={(
          <div style={{ padding: '1rem 2em 3rem', width: '60rem' }}
               className="ExtensionPicker gd-form">
            <div className="title">Extensions</div>

            <div className="ExtensionPicker-list ExtensionPicker-header">
              {tableFields.map(field => {
                return (<div className="ExtensionPicker-cell">{field}</div>);
              })}
            </div>

            <div className="ExtensionPicker-list">
              {Object.keys(this.state.extensions).map(key => this.state.extensions[key]).map(extension => {
                const values = {
                  name : extensionName(extension),
                  author : extensionAuthor(extension),
                  isClient : manifestIsClient(extension),
                  isServer : manifestIsServer(extension),
                  region : extensionRegion(extension),
                };

                //todo - map through fields + toggle

                return (<div className="ExtensionPicker-row" key={extension.name}>
                  <div className="ExtensionPicker-cell ExtensionPicker-name">{values.name}</div>
                  <div className="ExtensionPicker-cell">{values.author}</div>
                  <div className="ExtensionPicker-cell">{values.region}</div>
                  <div className="ExtensionPicker-cell">
                  <input type="checkbox"
                         className="ExtensionPicker-toggle"
                         checked={this.checkExtensionActive(extension.name)}
                         onChange={() => this.handleToggleExtension(extension.name)}/>
                    </div>
                </div>);
              })}
            </div>

            <div style={{ width: '200px', paddingTop: '1.5rem', textAlign: 'center' }}>
              <button
                type="submit"
                disabled={!this.state.dirty}
                onClick={() => this.submitForm()}>
                Submit
              </button>
            </div>
          </div>
        )}/>
    );
  }
}

function mapStateToProps(state) {
  return {
    config: state.user.config,
    open: state.ui.modals.showExtensionPicker,
  };
}

export default connect(mapStateToProps, {
  uiShowExtensionPicker,
  userUpdateConfig,
})(ExtensionPicker);
