import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux';
import {push} from 'react-router-redux';
import invariant from 'invariant';
import ModalWindow from '../modal/modalwindow';
import Balls from '../../components/balls/balls';
import Dropzone from 'react-dropzone';
import { uiShowGenBankImport } from '../../actions/ui';
import {projectGet, projectListAllBlocks} from '../../selectors/projects';
import {projectList, projectLoad} from '../../actions/projects';

import '../../../src/styles/genbank.css';

// purely for testing
const genbank_testing = `LOCUS       AC000263                 368 bp    mRNA    linear   PRI 05-FEB-1999
DEFINITION  Homo sapiens mRNA for prepro cortistatin like peptide, complete
            cds.
ACCESSION   AB000263
ORIGIN
        1 acaagatgcc attgtccccc ggcctcctgc tgctgctgct ctccggggcc acggccaccg
       61 ctgccctgcc cctggagggt ggccccaccg gccgagacag cgagcatatg caggaagcgg
      121 caggaataag gaaaagcagc ctcctgactt tcctcgcttg gtggtttgag tggacctccc
      181 aggccagtgc cgggcccctc ataggagagg aagctcggga ggtggccagg cggcaggaag
      241 gcgcaccccc ccagcaatcc gcgcgccggg acagaatgcc ctgcaggaac ttcttctgga
      301 agaccttctc ctcctgcaaa taaaacctca cccatgaatg ctcacgcaag tttaattaca
      361 gacctgaa
//
`;

/**
 * Genbank import dialog.
 * NOTE: For E2E Tests we check for a global __testGenbankImport. If present
 * we send the genbank_testing string above.
 */
class ImportGenBankModal extends Component {

  static propTypes = {

  };

  constructor() {
    super();
    this.state = {
      files: [],
      error: null,
      processing: false,
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

    if (this.state.files.length || window.__testGenbankImport) {
      this.setState({processing: true});
      const formData = new FormData();
      let isCSV = false;
      this.state.files.forEach(file => {
        formData.append('data', file, file.name);
        isCSV = file.name.toLowerCase().endsWith('.csv')
      });
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `/import/${isCSV ? 'csv' : 'genbank'}`, true);
      xhr.onload = () => {
        if (xhr.status === 200) {
          this.props.uiShowGenBankImport(false);
          const json = JSON.parse(xhr.response);
          invariant(json && json.ProjectId, 'expect a project ID');
          this.props.push(`/project/${json.ProjectId}`);
        } else {
          this.setState({error: `Error uploading file(s): ${xhr.status}`});
        }
        this.setState({processing: false});
      }
      xhr.send(window.__testGenbankImport ? genbank_testing : formData);
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
                <input type="radio" name="destination" disabled={this.state.processing}/>
                <div>My Inventory</div>
              </div>
              <div className="radio">
                <div/>
                <input type="radio" name="destination" disabled={this.state.processing}/>
                <div>My Project</div>
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
  push,
})(ImportGenBankModal);
