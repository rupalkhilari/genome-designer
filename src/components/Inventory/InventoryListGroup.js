import React, { Component, PropTypes } from 'react';
import invariant from 'invariant';

import '../../styles/InventoryListGroup.css';

export default class InventoryListGroup extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    disabled: PropTypes.bool,
    manual: PropTypes.bool,
    isSelectable: PropTypes.bool,
    isExpanded: PropTypes.bool,
    onToggle: PropTypes.func, //click toggle, you are required for maintaining state if manual...
    onSelect: PropTypes.func, //click title. return false if toggleOnSelect to prevent
    isActive: PropTypes.bool, //to do with color, not whether expanded or not
    hideToggle: PropTypes.bool, //disable toggler (hide it)
    toggleOnSelect: PropTypes.bool, //run toggling on selection
  };

  static defaultProps = {
    disabled: false,
    hideToggle: false,
    isActive: false,
    isExpanded: false,
    isSelectable: false,
    toggleOnSelect: true,
  };

  state = {
    expanded: false,
  };

  componentWillMount() {
    invariant(!this.props.manual || (this.props.hasOwnProperty('isExpanded') && this.props.hasOwnProperty('onToggle')), 'If the component is manual, you must pass isExpanded and onToggle to handle state changes');
  }

  handleToggle = (evt) => {
    const { disabled, manual, isExpanded, onToggle } = this.props;

    evt.stopPropagation();

    if (disabled) {
      return;
    }

    const nextState = manual ? !isExpanded : !this.state.expanded;
    if (!manual) {
      this.setState({ expanded: nextState });
    }

    onToggle && onToggle(nextState);
  };

  handleSelect = (evt) => {
    const { onSelect, toggleOnSelect, disabled } = this.props;

    if (disabled) {
      return;
    }

    if (((onSelect && onSelect(evt) !== false) || !onSelect) && !!toggleOnSelect) {
      this.handleToggle(evt);
    }
  };

  render() {
    const { isSelectable, hideToggle, title, manual, isExpanded, isActive, children, disabled } = this.props;
    const expanded = manual ? isExpanded : this.state.expanded;

    return (
      <div className={'InventoryListGroup' +
      (isSelectable ? ' isSelectable' : '') +
      (expanded ? ' expanded' : '') +
      (disabled ? ' disabled' : '') +
      (isActive ? ' active' : '')}>
        <div className="InventoryListGroup-heading"
             onClick={this.handleSelect}>
          {!hideToggle && <span className="InventoryListGroup-toggle"
                                onClick={this.handleToggle}/>}
          <a className="InventoryListGroup-title">
            <span>{title}</span>
          </a>
        </div>
        {expanded && <div className="InventoryListGroup-contents no-vertical-scroll">
          {children}
        </div>}
      </div>
    );
  }
}
