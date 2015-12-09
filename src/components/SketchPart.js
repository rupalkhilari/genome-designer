import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { blockRename } from '../actions/blocks';
import { inspectorSetCurrent } from '../actions/inspector';

import SketchPartName from './SketchPartName';

import '../styles/SketchPart.css';

export class SketchPart extends Component {
  static propTypes = {
    part: PropTypes.object.isRequired,  //once using real ones, can pass schema as PropType
    blockRename: PropTypes.func.isRequired,
    inspectorSetCurrent: PropTypes.func.isRequired,
  }

  handleRename = (event) => {
    const partId = this.props.part.id;
    const newName = event.target.value;

    this.props.blockRename(partId, newName);
  }

  render() {
    const { part } = this.props;
    const { name, color } = part.metadata;

    return (
      <div ref="partGroup"
           onClick={this.props.inspectorSetCurrent.bind(null, part)}
           className="SketchPart"
           style={{backgroundColor: color}}>
        <SketchPartName partName={name}
                        onChange={this.handleRename}/>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps, {
  blockRename,
  inspectorSetCurrent,
})(SketchPart);
