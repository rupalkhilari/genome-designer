import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import ModalWindow from '../modal/modalwindow';
import Dropzone from 'react-dropzone';
import { uiShowGenBankImport } from '../../actions/ui';
import { projectGet, projectListAllBlocks } from '../../selectors/projects';
import { projectList, projectLoad, projectOpen } from '../../actions/projects';
import { importGenbankOrCSV } from '../../middleware/genbank';

import '../../../src/styles/genbank.css';

/**
 * Genbank import dialog.
 */
class ImportGenBankModal extends Component {

  static propTypes = {
    projectOpen: PropTypes.func.isRequired,
    currentProjectId: PropTypes.string.isRequired,
    open: PropTypes.bool.isRequired,
    uiShowGenBankImport: PropTypes.func.isRequired,
    projectLoad: PropTypes.func.isRequired,
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

  componentWillReceiveProps(nextProps) {
    if (nextProps.open && !this.props.open) {
      this.setState({
        files: [],
        error: null,
      });
    }
  }

  onDrop(files) {
    this.setState({ files });
  }

  onSubmit(evt) {
    evt.preventDefault();
    this.setState({
      error: null,
    });

    if (this.state.files.length) {
      this.setState({
        processing: true,
      });
      const projectId = this.state.destination === 'current project' ? '/' + this.props.currentProjectId : '';
      const file = this.state.files[0];
      importGenbankOrCSV(file, projectId)
        .then(projectId => {
          if (projectId === this.props.currentProjectId) {
            this.props.projectLoad(projectId);
          } else {
            this.props.projectOpen(projectId);
          }
          this.setState({
            processing: false,
          });
          this.props.uiShowGenBankImport(false);
        })
        .catch(error => {
          this.setState({
            error: `Error uploading file: ${error}`,
            processing: false,
          });
        });
    }
  }

  showFiles() {
    const files = this.state.files.map((file, index) => {
      return <div className="file-name" key={index}>{file.name}</div>;
    });
    return files;
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
              <button type="submit" disabled={this.state.processing}>Upload</button>
              <button
                type="button"
                disabled={this.state.processing}
                onClick={() => {
                  this.props.uiShowGenBankImport(false);
                }}>Cancel
              </button>
              <div className="link">
                <span>Format documentation and same .CSV files can be found here</span>
                <a className="blue-link" href="https://forum.bionano.autodesk.com/t/importing-data-using-csv-format" target="_blank">discourse.bionano.autodesk.com/genetic-constructor/formats</a>
              </div>
            </form>
          )}
          closeOnClickOutside
          closeModal={buttonText => {
            this.props.uiShowGenBankImport(false);
          }}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    open: state.ui.modals.showGenBankImport,
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
