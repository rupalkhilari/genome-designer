import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import parts from '../../inventory/andrea/parts';
import ListOption from './ListOption';
import { blockOptionsToggle } from '../../actions/blocks';

import { get as pathGet } from 'lodash'; //todo - delegate filtering to block model

import '../../styles/ListOptions.css';

export class ListOptions extends Component {
  static propTypes = {
    block: PropTypes.shape({
      id: PropTypes.string.isRequired,
      rules: PropTypes.shape({
        filter: PropTypes.object.isRequired,
      }).isRequired,
    }).isRequired,
    blockOptionsToggle: PropTypes.func.isRequired,
  };

  onSelectOption = (option) => {
    this.props.blockOptionsToggle(this.props.block.id, option.id);
  };

  render() {
    const { block } = this.props;
    const { options } = block;
    const { filter } = block.rules;

    const filtered = parts.filter(part => {
      return Object.keys(filter).every(key => {
        const value = filter[key];
        return pathGet(part, key) === value;
      });
    });

    return (
      <div className="ListOptions">
        {filtered.map(item => {
          return (
            <ListOption
              option={item}
              selected={options.includes(item.id)}
              onClick={(option) => this.onSelectOption(option)}/>
          );
        })}
      </div>
    );
  }
}

export default connect(() => ({}), {
  blockOptionsToggle,
})(ListOptions);

