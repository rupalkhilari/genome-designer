import React, { Component, Children, PropTypes } from 'react';
import invariant from 'invariant';

import '../../styles/InventoryListGroup.css';

export default class InventoryListGroup extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    manual: PropTypes.bool,
    isExpanded: PropTypes.bool,
    onToggle: PropTypes.func, //you are required for maintaining state...
    isActive: PropTypes.bool, //to do with color, not whether expanded or not
  };

  state = {
    expanded: false,
  };

  componentWillMount() {
    invariant(!this.props.manual || (this.props.hasOwnProperty('isExpanded') && this.props.hasOwnProperty('onToggle')), 'If the component is manual, you must pass isExpanded and onToggle to handle state changes');
  }

  handleToggle = () => {
    const { manual, isExpanded, onToggle } = this.props;
    const nextState = manual ? !isExpanded : !this.state.expanded;
    if (!manual) {
      this.setState({ expanded: nextState });
    }

    onToggle && onToggle(nextState);
  };

  render() {
    const { title, manual, isExpanded, isActive, children } = this.props;
    const expanded = manual ? isExpanded : this.state.expanded;

    return (
      <div className={'InventoryListGroup' +
      (expanded ? ' expanded' : '') +
      (isActive ? ' active' : '')}>
        <div onClick={this.handleToggle}>
          <span className="InventoryListGroup-toggle"/>
          <a className="InventoryListGroup-title">
            <span>{title}</span>
          </a>
        </div>
        {expanded && <div className="InventoryListGroup-contents">
          {Children.only(children)}
        </div>}
      </div>
    );
  }
}
