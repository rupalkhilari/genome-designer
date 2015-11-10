import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { partRename } from '../actions/parts';

import SketchPartName from './SketchPartName';

import styles from '../styles/SketchPart.css';
import withStyles from '../decorators/withStyles';

@withStyles(styles)
export class SketchPart extends Component {
  static propTypes = {
    part: PropTypes.object.isRequired,  //once using real ones, can pass schema as PropType
    partRename: PropTypes.func.isRequired,
  }

  handleRename = (event) => {
    const partId = this.props.part.id;
    const newName = event.target.value;

    this.props.partRename(partId, newName);
  }

  render() {
    const {part} = this.props;
    const partName = part.metadata.name;

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

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps, {
  partRename,
})(SketchPart);
