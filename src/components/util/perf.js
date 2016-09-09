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

import { Component, createElement } from 'react'
import ReactPerf from 'react-addons-perf';

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

function getNow() {
  if (window && window.performance) {
    return window.performance.now();
  }
  return +Date.now();
}

/**
 * @private
 * Higher order component to track performance of a React component's render() using ReactPerf addon + performance.now()
 * Can be used as decorator
 *
 * @param  {ReactComponent} Component
 * @return {ReactComponent}
 */
export default function perf(Component) {
  if (process.env.NODE_ENV !== 'production') {
    class Perf extends Component {
      componentDidMount() {
        this.start = getNow();
        ReactPerf.start();
      }

      componentDidUpdate() {
        this.end = getNow();
        console.log(this.end - this.start); //eslint-disable-line

        const measurements = ReactPerf.getLastMeasurements();
        ReactPerf.printWasted(measurements);
        ReactPerf.start();
      }

      getWrappedInstance() {
        return this.refs.wrappedInstance;
      }

      render() {
        this.renderedElement = createElement(Component, {
          ...this.props,
          ref: 'wrappedInstance',
        });

        return this.renderedElement;
      }
    }

    Perf.displayName = `Perf(${getDisplayName(Component)})`;

    return Perf;
  }
  return Component;
}
