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
import { reportError } from '../../middleware/reporting';

const initialState = {
  title: '',
  description: '',
  submitted: false,
  createdUrl: null,
}

class SaveErrorModal extends Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    uiReportError: PropTypes.func.isRequired,
  };

  state = Object.assign({}, initialState);

  formValid = () => {
    const { title, description } = this.state;
    return !!title && title.length > 8 && !!description && description.length > 5;
  };

  submitForm = () => {
    const url = window.location.href;
    const user = window.flashedUser.userid; //todo - should use action
    const { title, description } = this.state;

    this.setState({
      submitted: true,
    });

    return reportError(title, description, url, user)
      .then(json => {
        console.log(json);
        this.setState({
          createdUrl: json.html_url,
        });
      })
      .catch(err => {
        console.error(err);
        this.setState({
          submitted: false,
        });
      });
  };

  closeModal = () => {
    this.setState(Object.assign({}, initialState));
    this.props.uiReportError(false);
  };

  render() {
    if (!this.props.open) {
      return null;
    }

    const { createdUrl } = this.state;
    const formvalid = this.formValid();

    return (
      <ModalWindow
        open={this.props.open}
        closeOnClickOutside
        title="Report an Issue"
        closeModal={this.closeModal}
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

            {createdUrl && (<div style={{paddingTop: '1.5rem', textAlign: 'center'}}>
              Thank you! Your issue has been logged at <a href={createdUrl} target="_blank">GitHub (account required)</a>
            </div>)}

            <div style={{ width: '200px', paddingTop: '1.5rem', textAlign: 'center' }}>
              <button
                type="submit"
                disabled={!formvalid}
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
    open: state.ui.modals.showReportError,
  };
}

export default connect(mapStateToProps, {
  uiReportError,
})(SaveErrorModal);
