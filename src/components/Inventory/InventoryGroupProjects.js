import React, { Component, PropTypes } from 'react';

export class InventoryGroupProjects extends Component {
  static propTypes = {
    projects: PropTypes.object.isRequired,
  };

  render() {
    const { projects } = this.props;

    return (
      <div className="InventoryGroupProjects">
        todo
      </div>
    );
  }
}


function mapStateToProps(state, props) {
  const { projects } = state;

  return {
    projects,
  };
}

export default connect(mapStateToProps, {})(InventoryGroupProjects);
