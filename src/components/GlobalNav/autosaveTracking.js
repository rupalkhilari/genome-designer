import React, { PropTypes, Component } from 'react';
import autosaveInstance from '../../store/autosave/autosaveInstance';

import '../../styles/AutosaveTracking.css';

export default class autosaveTracking extends Component {
  //overridden using forceUpdate
  shouldComponentUpdate() {
    return false;
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      this.forceUpdate();
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const lastSaved = autosaveInstance.getLastSaved();
    const saveDelta = +Date.now() - lastSaved;
    const timeUnsaved = autosaveInstance.getTimeUnsaved();
    const dirty = autosaveInstance.isDirty();

    const finalText = dirty || saveDelta < 30000 ?
      '' :
      (saveDelta > 3000 ? 'Project Saved' : 'Saving...');

    return (<span className="AutosaveTracking">{finalText}</span>);
  }
}
