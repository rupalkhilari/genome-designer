import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux';
import invariant from 'invariant';
import ModalWindow from '../modal/modalwindow';
import Dropzone from 'react-dropzone';
import { uiShowGenBankImport } from '../../actions/ui';

import '../../../src/styles/genbank.css';

class ImportGenBankModal extends Component {

  static propTypes = {

  };

  constructor() {
    super();
    this.state = {
      files: [],
      error: null,
    };
  }

  onDrop(files) {
    this.setState({files});
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

    if (this.state.files.length) {
      const formData = new FormData();
      this.state.files.forEach(file => {
        formData.append('genBankFiles', file, file.name);
      });
      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/import/project/genbank', true);
      xhr.setRequestHeader("Content-type", null);
      xhr.onload = () => {
        if (xhr.status === 200) {
          this.props.uiShowGenBankImport(false);
        } else {
          this.setState({error: `Error uploading file(s): ${xhr.status}`});
        }
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
              onSubmit={this.onSubmit.bind(this)}
              id="genbank-import-form"
              className="genbank-import-form">
              <div className="title">Import</div>
              <div className="radio">
                <div>Import data to:</div>
                <input type="radio" name="destination"/>
                <div>My Inventory</div>
              </div>
              <div className="radio">
                <div/>
                <input type="radio" name="destination"/>
                <div>My Project</div>
              </div>
              <Dropzone onDrop={this.onDrop.bind(this)} className="dropzone" activeClassName="dropzone-hot">
                <div className="dropzone-text">Drop Files Here</div>
              </Dropzone>
              {this.showFiles()}
              {this.state.error ? <div className="error">{this.state.error}</div> : null}
              <div className="form-buttons">
                <button
                  type="button"
                  onClick={() => {
                    this.props.uiShowGenBankImport(false);
                  }}>Cancel</button>
                <button type="submit">Upload</button>
            </div>
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
})(ImportGenBankModal);
