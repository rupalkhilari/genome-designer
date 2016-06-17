import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { uiShowAbout } from '../actions/ui';
import ModalWindow from './modal/modalwindow';

import '../../src/styles/form.css';
import '../..//src/styles/aboutform.css';

class AboutForm extends Component {

  static propTypes = {
    uiShowAbout: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
  };

  render() {
    // no render when not open
    if (!this.props.open) {
      return null;
    }

    return (<ModalWindow
      open={this.props.open}
      title="Genome Designer"
      closeOnClickOutside
      closeModal={(buttonText) => {
        this.props.uiShowAbout(false);
      }}
      payload={
          <div className="gd-form aboutform">
            <div className="image">
              <img className="background" src="/images/homepage/tiles.jpg"/>
              <div className="name">Genetic Constructor</div>
            </div>
            <div className="text">
              <div className="heading">
                © 2016 Autodesk, Inc. All rights reserved.
              </div>
              All use of this Service is subject to the terms and conditions of the A360 Terms of Service and Privacy Statement accepted upon access of this Service.
              This service may incorporate or use background Autodesk technology components. For information about these components, click here:
              <a href="http://www.autodesk.com/cloud-platform-components">&nbsp;www.autodesk.com/cloud-platform-components</a>
              <div className="heading">
                Trademarks
              </div>
              Autodesk is a registered trademark or trademark of Autodesk, Inc., and/or its subsidiaries and/or affiliates.
              All other brand names, product names or trademarks belong to their respective holders.
              <div className="heading">
                Third-Party Software Credits and Attributions
              </div>
              Portions relating to ansi-to-html-umd 0.4.2 are Copyright (c)<br/>
              Portions relating to babel-runtime 6.6.1 are Copyright (c)<br/>
              Portions relating to bootstrap 3.3.6 are Copyright (c)<br/>
              Portions relating to cookie-parser 1.4.1 are Copyright (c)<br/>
              Portions relating to d3 3.5.12 are Copyright (c)<br/>
              Portions relating to deep-freeze 0.0.1 are Copyright (c)<br/>
              Portions relating to fast-csv 1.0.0 are Copyright (c)<br/>
              Portions relating to formidable 1.0.17 are Copyright (c)<br/>
              Portions relating to history 1.17.0 are Copyright (c)<br/>
              Portions relating to invariant 2.2.0 are Copyright (c)<br/>
              Portions relating to isomorphic-fetch 2.1.1 are Copyright (c)<br/>
              Portions relating to jade 1.11.0 are Copyright (c)<br/>
              Portions relating to jquery 2.1.4 are Copyright (c)<br/>
              Portions relating to load-script 1.0.0 are Copyright (c)<br/>
              Portions relating to lodash 4.5.1 are Copyright (c)<br/>
              Portions relating to lodash.clonedeep 3.0.2 are Copyright (c)<br/>
              Portions relating to lodash.debounce 3.1.1 are Copyright (c)<br/>
              Portions relating to lodash.merge 3.3.2 are Copyright (c)<br/>
              Portions relating to lodash.set 3.7.4 are Copyright (c)<br/>
              Portions relating to md5 2.0.0 are Copyright (c)<br/>
              Portions relating to mkdirp 0.5.1 are Copyright (c)<br/>
              Portions relating to mkpath 1.0.0 are Copyright (c)<br/>
              Portions relating to mousetrap 1.5.3 are Copyright (c)<br/>
              Portions relating to node-uuid 1.4.7 are Copyright (c)<br/>
              Portions relating to nodegit 0.9.0 are Copyright (c)<br/>
              Portions relating to normalize.css 3.0.3 are Copyright (c)<br/>
              Portions relating to normalizr 1.2.0 are Copyright (c)<br/>
              Portions relating to promised-exec 1.0.1 are Copyright (c)<br/>
              Portions relating to query-string 3.0.1 are Copyright (c)<br/>
              Portions relating to random-js 1.0.8 are Copyright (c)<br/>
              Portions relating to react 0.14.8 are Copyright (c)<br/>
              Portions relating to react-addons-clone-with-props 0.14.3 are Copyright (c)<br/>
              Portions relating to react-addons-css-transition-group 0.14.8 are Copyright (c)<br/>
              Portions relating to react-addons-test-utils 0.14.2 are Copyright (c)<br/>
              Portions relating to react-bootstrap 0.28.2 are Copyright (c)<br/>
              Portions relating to react-dom 0.14.2 are Copyright (c)<br/>
              Portions relating to react-dropzone 3.3.2 are Copyright (c)<br/>
              Portions relating to react-redux 3.1.0 are Copyright (c)<br/>
              Portions relating to react-router 2.0.0 are Copyright (c)<br/>
              Portions relating to react-router-redux 4.0.0 are Copyright (c)<br/>
              Portions relating to read-multiple-files 1.1.1 are Copyright (c)<br/>
              Portions relating to redux 3.0.2 are Copyright (c)<br/>
              Portions relating to redux-logger 2.0.2 are Copyright (c)<br/>
              Portions relating to redux-thunk 0.1.0 are Copyright (c)<br/>
              Portions relating to rimraf 2.5.1 are Copyright (c)<br/>
              Portions relating to sha1 1.1.1 are Copyright (c)<br/>
              Portions relating to url-regex 3.0.0 are Copyright (c)<br/>
              Portions relating to yamljs 0.2.4 are Copyright (c)<br/>
              Portions relating to autoprefixer 6.0.3 are Copyright (c)<br/>
              Portions relating to babel-cli 6.4.5 are Copyright (c)<br/>
              Portions relating to babel-core 6.4.5 are Copyright (c)<br/>
              Portions relating to babel-eslint 4.1.6 are Copyright (c)<br/>
              Portions relating to babel-loader 6.2.1 are Copyright (c)<br/>
              Portions relating to babel-plugin-add-module-exports 0.1.2 are Copyright (c)<br/>
              Portions relating to babel-plugin-react-transform 2.0.0 are Copyright (c)<br/>
              Portions relating to babel-plugin-transform-class-properties 6.4.0 are Copyright (c)<br/>
              Portions relating to babel-plugin-transform-decorators-legacy 1.3.4 are Copyright (c)<br/>
              Portions relating to babel-plugin-transform-runtime 6.7.5 are Copyright (c)<br/>
              Portions relating to babel-polyfill 6.3.14 are Copyright (c)<br/>
              Portions relating to babel-preset-es2015 6.3.13 are Copyright (c)<br/>
              Portions relating to babel-preset-react 6.3.13 are Copyright (c)<br/>
              Portions relating to babel-preset-stage-0 6.3.13 are Copyright (c)<br/>
              Portions relating to babel-register 6.4.3 are Copyright (c)<br/>
              Portions relating to bluebird 3.3.4 are Copyright (c)<br/>
              Portions relating to body-parser 1.14.1 are Copyright (c)<br/>
              Portions relating to browser-sync 2.11.2 are Copyright (c)<br/>
              Portions relating to chai 3.4.1 are Copyright (c)<br/>
              Portions relating to cli-color 1.1.0 are Copyright (c)<br/>
              Portions relating to combokeys 2.4.4 are Copyright (c)<br/>
              Portions relating to css-loader 0.23.0 are Copyright (c)<br/>
              Portions relating to del 2.2.0 are Copyright (c)<br/>
              Portions relating to eslint 1.9.0 are Copyright (c)<br/>
              Portions relating to eslint-config-airbnb 0.1.0 are Copyright (c)<br/>
              Portions relating to eslint-plugin-react 3.7.1 are Copyright (c)<br/>
              Portions relating to express 4.13.3 are Copyright (c)<br/>
              Portions relating to file-loader 0.8.5 are Copyright (c)<br/>
              Portions relating to jsdom 7.0.2 are Copyright (c)<br/>
              Portions relating to json-loader 0.5.4 are Copyright (c)<br/>
              Portions relating to mocha 2.2.5 are Copyright (c)<br/>
              Portions relating to morgan 1.6.1 are Copyright (c)<br/>
              Portions relating to ncp 2.0.0 are Copyright (c)<br/>
              Portions relating to nightwatch 0.8.6 are Copyright (c)<br/>
              Portions relating to node-resemble-js 0.0.5 are Copyright (c)<br/>
              Portions relating to postcss 5.0.10 are Copyright (c)<br/>
              Portions relating to postcss-cssnext 2.2.0 are Copyright (c)<br/>
              Portions relating to postcss-import 7.1.0 are Copyright (c)<br/>
              Portions relating to postcss-loader 0.7.0 are Copyright (c)<br/>
              Portions relating to postcss-nested 1.0.0 are Copyright (c)<br/>
              Portions relating to react-transform-catch-errors 1.0.1 are Copyright (c)<br/>
              Portions relating to react-transform-hmr 1.0.1 are Copyright (c)<br/>
              Portions relating to redbox-react 1.0.1 are Copyright (c)<br/>
              Portions relating to redux-devtools 3.0.1 are Copyright (c)<br/>
              Portions relating to redux-devtools-dock-monitor 1.0.1 are Copyright (c)<br/>
              Portions relating to redux-devtools-log-monitor 1.0.2 are Copyright (c)<br/>
              Portions relating to rimraf 2.3.4 are Copyright (c)<br/>
              Portions relating to selenium-standalone 4.9.1 are Copyright (c)<br/>
              Portions relating to sinon 1.17.2 are Copyright (c)<br/>
              Portions relating to sinon-chai 2.8.0 are Copyright (c)<br/>
              Portions relating to source-map-support 0.4.0 are Copyright (c)<br/>
              Portions relating to style-loader 0.13.0 are Copyright (c)<br/>
              Portions relating to supertest 1.1.0 are Copyright (c)<br/>
              Portions relating to url-loader 0.5.7 are Copyright (c)<br/>
              Portions relating to webpack 1.9.6 are Copyright (c)<br/>
              Portions relating to webpack-dev-middleware 1.2.0 are Copyright (c)<br/>
              Portions relating to webpack-hot-middleware 2.0.0 are Copyright (c)<br/>
              <br/>
              Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the Software), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
              The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
              THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
            </div>
            <br/>
            <button
              type="submit"
              onClick={() => {
                this.props.uiShowAbout(false);
              }}>Close
            </button>
          </div>}
    />);
  }
}

function mapStateToProps(state) {
  return {
    open: state.ui.modals.showAbout,
  };
}

export default connect(mapStateToProps, {
  uiShowAbout,
})(AboutForm);
