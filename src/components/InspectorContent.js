import React, { Component, PropTypes } from 'react';
import { blockSetColor } from '../actions/blocks';
import { connect } from 'react-redux';
import ColorPicker from './ui/ColorPicker';

//for now, assumes only blocks. Later, may need to pass a type as well

export class InspectorContent extends Component {
  static propTypes = {
    instance: PropTypes.object.isRequired,
    blockSetColor: PropTypes.func.isRequired,
  }

  selectColor = (color) => {
    this.props.blockSetColor(this.props.instance.id, color);
  }

  render() {
    const { instance } = this.props;

    return (
      <div className="InspectorContent InspectorContentBlock">
        <h4 className="InspectorContent-heading">Name</h4>
        <p>{instance.metadata.name || 'Unnamed'}</p>

        <h4 className="InspectorContent-heading">Description</h4>
        <p>{instance.metadata.description || 'No Description'}</p>

        <h4 className="InspectorContent-heading">Color</h4>
        <ColorPicker current={instance.metadata.color}
                     onSelect={this.selectColor} />

        <h4 className="InspectorContent-heading">Symbol</h4>

      </div>
    );
  }
}

export default connect(() => ({}), {
  blockSetColor,
})(InspectorContent);
