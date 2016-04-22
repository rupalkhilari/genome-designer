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
    const timeUnsaved = autosaveInstance.getTimeUnsaved();
    const dirty = autosaveInstance.isDirty();
    const seconds = Math.floor(timeUnsaved / 1000);
    const lastSavedText = `Project Saved ${seconds} seconds ago`;
    const dirtyText = dirty ? ', unsaved changes' : ', no unsaved changes';
    const finalText = dirty ? lastSavedText : 'Project Saved';

    return (<span className="AutosaveTracking">{finalText}</span>);
  }
}
