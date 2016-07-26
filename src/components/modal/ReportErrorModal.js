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
import { uiReportError } from '../../actions/ui';
import rejectingFetch from '../../middleware/rejectingFetch';

class SaveErrorModal extends Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    uiReportError: PropTypes.func.isRequired,
  };

  state = {
    title: '',
    description: '',
  };

  formValid = () => {
    const { title, description } = this.state;
    console.log(title, description);
    return !!title && title.length > 8 && !!description && description.length > 5;
  };

  reportError = () => {
    const url = window.location.href;
    const user = window.flashedUser.userid; //fixme - this is a bit hack, should use action
    const { title, description } = this.state;
    const body = `### URL
${url}

### Description

${description}

### User

${user}`;

    const payload = {
      title,
      body,
      labels: ['bug:web'],
    };

    debugger;

    rejectingFetch('https://api.github.com/repos/autodesk-bionano/genome-designer/issues', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then(resp => resp.json())
      .then(json => {
        console.log(json);
        this.props.uiReportError(false);
      });
  };

  render() {
    if (!this.props.open) {
      return null;
    }
    const formvalid = this.formValid();

    return (
      <ModalWindow
        open={this.props.open}
        title="Report an Issue"
        closeModal={() => this.props.uiReportError(false)}
        payload={(
          <div className="gd-form"
                style={{ padding: '1rem 2em 3rem', width: '50vw', minWidth: '300px' }}>
            <div className="title">Report an Issue</div>

            <input ref="title"
                   type="text"
                   placeholder="Title"
                   value={this.state.title}
                   onChange={evt => this.setState({title: evt.target.value}) }/>

            <textarea ref="description"
                      rows="5"
                      placeholder="Please describe what led to the issue"
                      value={this.state.description}
                      onChange={evt => this.setState({description: evt.target.value})} />

            <div style={{ width: '200px', paddingTop: '1.5rem', textAlign: 'center' }}>
              <button
                type="submit"
                disabled={!formvalid}
                onClick={() => this.reportError()}>
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
    open: state.ui.modals.showReportError,
  };
}

export default connect(mapStateToProps, {
  uiReportError,
})(SaveErrorModal);
