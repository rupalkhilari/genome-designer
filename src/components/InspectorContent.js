import React, { Component, PropTypes } from 'react';
import { blockSetColor, blockSetSbol } from '../actions/blocks';
import { connect } from 'react-redux';
import ColorPicker from './ui/ColorPicker';
import SymbolPicker from './ui/SymbolPicker';

//for now, assumes only blocks. Later, may need to pass a type as well

export class InspectorContent extends Component {
  static propTypes = {
    instance: PropTypes.object.isRequired,
    blockSetColor: PropTypes.func.isRequired,
    blockSetSbol: PropTypes.func.isRequired,
  }

  selectColor = (color) => {
    this.props.blockSetColor(this.props.instance.id, color);
  }

  selectSymbol = (symbol) => {
    this.props.blockSetSbol(this.props.instance.id, symbol);
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
                     onSelect={this.selectColor}/>

        <h4 className="InspectorContent-heading">Symbol</h4>
        <SymbolPicker current={instance.rules.sbol}
                      onSelect={this.selectSymbol}/>


      </div>
    );
  }
}

export default connect(() => ({}), {
  blockSetColor,
  blockSetSbol,
})(InspectorContent);
