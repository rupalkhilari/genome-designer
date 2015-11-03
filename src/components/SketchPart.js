import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { part_rename } from '../actions/parts';

import SketchPartName from './SketchPartName';

import styles from '../styles/SketchPart.css';
import withStyles from '../decorators/withStyles';

@withStyles(styles)
export class SketchPart extends Component {

  static PropTypes = {
    part       : PropTypes.object.isRequired,  //once using real ones, can pass schema as PropType
    part_rename: PropTypes.func.isRequired
  }

  handleRename = (e) => {
    let partId  = this.props.part.id,
        newName = e.target.value;

    this.props.part_rename(partId, newName);
  }

  render () {
    let {part} = this.props,
        partName = part.metadata.name;

    return (
      <div ref="partGroup"
           className="SketchPart"
           style={{backgroundColor: part.color}}>
        <SketchPartName partName={partName}
                        onChange={this.handleRename}/>
      </div>
    );
  }
}

function mapStateToProps (state) {
  return {}
}

export default connect(mapStateToProps, {
  part_rename
})(SketchPart);