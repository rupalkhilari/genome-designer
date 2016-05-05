import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import invariant from 'invariant';
import ModalWindow from '../modal/modalwindow';
import Balls from '../../components/balls/balls';
import Dropzone from 'react-dropzone';
import { uiShowGenBankImport } from '../../actions/ui';
import { projectGet, projectListAllBlocks } from '../../selectors/projects';
import { projectList, projectLoad, projectOpen } from '../../actions/projects';

import '../../../src/styles/genbank.css';

/**
 * Genbank import dialog.
 * NOTE: For E2E Tests we check for a global __testGenbankImport. If present
 * we send the genbank_testing string above.
 */
class ImportGenBankModal extends Component {

  static propTypes = {
    projectOpen: PropTypes.func.isRequired,
  };

  constructor() {
    super();
    this.state = {
      files: [],
      error: null,
      processing: false,
      destination: 'new project', // or 'current project'
    };
  }

  onDrop(files) {
    this.setState({ files });
  }

  showFiles() {
    const files = this.state.files.map((file, index) => {
      return <div className="file-name" key={index}>{file.name}</div>
    });
    return files;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.open && !this.props.open) {
      this.setState({
        files: [],
        error: null,
      });
    }
  }

  onSubmit(evt) {
    evt.preventDefault();

    this.setState({
      error: null
    });

    if (this.state.files.length || window.__testGenbankImport) {
      this.setState({ processing: true });
      const formData = new FormData();

      let isCSV = false;
      invariant(this.state.files.length === 1, 'currently import only supports 1 file at a time, the UI should not allow more');
      const file = this.state.files[0];
      formData.append('data', file, file.name);
      isCSV = file.name.toLowerCase().endsWith('.csv')

      const xhr = new XMLHttpRequest();
      const uri = `/import/${isCSV ? 'csv' : 'genbank'}${this.state.destination === 'current project' ? '/' + this.props.currentProjectId : ''}`;

      xhr.open('POST', uri, true);
      xhr.onload = () => {
        if (xhr.status === 200) {
          this.props.uiShowGenBankImport(false);
          const json = JSON.parse(xhr.response);
          invariant(json && json.ProjectId, 'expect a project ID');
          if (json.ProjectId === this.props.currentProjectId) {
            this.props.projectLoad(json.ProjectId);
          } else {
            this.props.projectOpen(json.ProjectId)
          }
        } else {
          this.setState({ error: `Error uploading file(s): ${xhr.status}` });
        }
        this.setState({ processing: false });
      }
      xhr.send(formData);
    }
  }

  render() {
    if (!this.props.open) {
      return null;
    }
    return (
      <div>
        <ModalWindow
          open
          title="Import GenBank File"
          payload={(
            <form
              disabled={this.state.processing}
              onSubmit={this.onSubmit.bind(this)}
              id="genbank-import-form"
              className="gd-form genbank-import-form">
              <div className="title">Import</div>
              <div className="radio">
                <div>Import data to:</div>
                <input
                  checked={this.state.destination === 'new project'}
                  type="radio"
                  name="destination"
                  disabled={this.state.processing}
                  onChange={() => this.setState({destination: 'new project'})}
                  />
                <div>New Project</div>
              </div>
              <div className="radio">
                <div/>
                <input
                  checked={this.state.destination === 'current project'}
                  type="radio"
                  name="destination"
                  disabled={this.state.processing}
                  onChange={() => this.setState({destination: 'current project'})}
                  />
                <div>Current Project</div>
              </div>
              <Dropzone
                onDrop={this.onDrop.bind(this)}
                className="dropzone"
                activeClassName="dropzone-hot"
                multiple={false}>
                <div className="dropzone-text">Drop Files Here</div>
              </Dropzone>
              {this.showFiles()}
              {this.state.error ? <div className="error visible">{this.state.error}</div> : null}
              <Balls running={this.state.processing} color={'lightgray'}/>
              <button type="submit" disabled={this.state.processing}>Upload</button>
              <button
                type="button"
                disabled={this.state.processing}
                onClick={() => {
                  this.props.uiShowGenBankImport(false);
                }}>Cancel
              </button>


            </form>
          )}
          closeOnClickOutside
          closeModal={buttonText => {
            this.props.uiShowGenBankImport(false);
          }}
        />);

      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    open: state.ui.showGenBankImport,
  };
}

export default connect(mapStateToProps, {
  uiShowGenBankImport,
  projectGet,
  projectListAllBlocks,
  projectList,
  projectLoad,
  projectOpen,
})(ImportGenBankModal);
