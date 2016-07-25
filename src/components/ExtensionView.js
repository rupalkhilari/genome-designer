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
import extensionRegistry, { validRegion, downloadAndRender } from '../extensions/clientRegistry';
import { isEqual } from 'lodash';

import '../styles/ExtensionView.css';

export default class ExtensionView extends Component {
  static propTypes = {
    region: function regionPropValidator(props, name) {
      if (!validRegion(props[name])) {
        return new Error(`invalid region provided to ExtensionView, got ${props[name]}`);
      }
    },
    extension: function regionPropValidator(props, name) {
      const extension = props[name];
      if (!extensionRegistry[extension]) {
        return new Error(`invalid extension key, got ${extension}`);
      }
    },
  };

  constructor() {
    super();
    this.callback = null;
  }

  state = {
    downloaded: false,
  };

  componentDidMount() {
    this.renderExtension();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.extension !== nextProps.extension) {
      this.setState({
        downloaded: false,
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(this.props, nextProps);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.extension !== this.props.extension) {
      this.unmountExtension();
      this.renderExtension();
    }
  }

  componentWillUnmount() {
    this.unmountExtension();
  }

  //when extension changes or unmount, call unregister handler if we have one
  unmountExtension() {
    if (typeof this.callback === 'function') {
      try {
        this.callback();
      } catch (err) {
        console.log('error on unregister callback');
        console.error(err);
      }
    }
    this.callback = null;
  }

  renderExtension() {
    const { extension } = this.props;

    //clear contents
    this.element.innerHTML = '';

    if (!extension) {
      return;
    }

    try {
      setTimeout(() => {
        const boundingBox = this.element.getBoundingClientRect();

        downloadAndRender(extension, this.element, { boundingBox })
          .then((unregister) => {
            //todo - better handle scenario of extension loaded but not rendered (i.e. callback not yet set) - want to unregister immediately
            this.callback = unregister;
            this.setState({
              downloaded: true,
            });
          });
      });
    } catch (err) {
      console.error('error loading / rendering extension ' + extension);
      throw err;
    }
  }

  //todo - better error handling for extension loading + the status / default text
  render() {
    const { extension } = this.props;
    const { downloaded } = this.state;

    if (!extension) {
      return null;
    }

    return (
      <div className={'ExtensionView'}>
        <div className="ExtensionView-content" ref={(el) => {
          if (el) {
            this.element = el;
          }
        }}>
        </div>
      </div>
    );
  }
}
