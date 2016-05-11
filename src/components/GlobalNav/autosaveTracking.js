import React, { PropTypes, Component } from 'react';
import autosaveInstance from '../../store/autosave/autosaveInstance';

import '../../styles/AutosaveTracking.css';

export default class autosaveTracking extends Component {
  componentDidMount() {
    this.interval = setInterval(() => {
      this.forceUpdate();
    }, 500);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const lastSaved = autosaveInstance.getLastSaved();
    const saveDelta = +Date.now() - lastSaved;
    const dirty = autosaveInstance.isDirty();
    const failed = !autosaveInstance.saveSuccessful();

    let text;
    if (failed) {
      text = 'Save Failed!';
    } else if (dirty || saveDelta > 15000) {
      text = '';
    } else if (saveDelta <= 500) {
      text = 'Saving...';
    } else {
      text = 'Project Saved';
    }

    return (<span className="AutosaveTracking">{text}</span>);
  }
}
