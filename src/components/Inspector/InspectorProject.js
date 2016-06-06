import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { transact, commit, abort } from '../../store/undo/actions';
import { projectRename, projectMerge } from '../../actions/projects';
import InputSimple from './../InputSimple';
import Project from '../../models/Project';

export class InspectorProject extends Component {
  static propTypes = {
    instance: (props, propName) => {
      if (!(props[propName] instanceof Project)) {
        return new Error('must pass a project (Project model) to InspectorProject');
      }
    },
    projectRename: PropTypes.func.isRequired,
    projectMerge: PropTypes.func.isRequired,
    readOnly: PropTypes.bool.isRequired,
    transact: PropTypes.func.isRequired,
    commit: PropTypes.func.isRequired,
    abort: PropTypes.func.isRequired,
  };

  setProjectName = (name) => {
    this.props.projectRename(this.props.instance.id, name);
  };

  setProjectDescription = (description) => {
    if (description !== this.props.instance.metadata.description) {
      this.props.projectMerge(this.props.instance.id, { metadata: { description } });
    }
  };

  startTransaction = () => {
    this.props.transact();
  };

  endTransaction = (shouldAbort = false) => {
    if (shouldAbort === true) {
      this.props.abort();
      return;
    }
    this.props.commit();
  };

  render() {
    const { instance, readOnly } = this.props;

    return (
      <div className="InspectorContent InspectorContentProject">
        <h4 className="InspectorContent-heading">Project</h4>
        <InputSimple placeholder="Project Name"
                     onChange={this.setProjectName}
                     onFocus={this.startTransaction}
                     onBlur={this.endTransaction}
                     onEscape={() => this.endTransaction(true)}
                     readOnly={readOnly}
                     maxLength={256}
                     value={instance.metadata.name}/>

        <h4 className="InspectorContent-heading">Description</h4>
        <InputSimple placeholder="Project Description"
                     useTextarea
                     onChange={this.setProjectDescription}
                     onFocus={this.startTransaction}
                     onBlur={this.endTransaction}
                     onEscape={() => this.endTransaction(true)}
                     readOnly={readOnly}
                     maxLength={2048}
                     value={instance.metadata.description}/>
      </div>
    );
  }
}

export default connect(() => ({}), {
  projectRename,
  projectMerge,
  transact,
  commit,
  abort,
})(InspectorProject);
