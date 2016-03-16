import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { uiToggleDetailView } from '../actions/ui';
import { extensionsByRegion, registry } from '../extensions/clientRegistry';
import mapValues from '../utils/object/mapValues';

import '../styles/ProjectDetail.css';

export class ProjectDetail extends Component {
  static propTypes = {
    uiToggleDetailView: PropTypes.func.isRequired,
    isVisible: PropTypes.bool.isRequired,
    project: PropTypes.object.isRequired,
  };

  componentDidMount() {
    //to update when extensions register... todo - need a pubsub method
    setTimeout(() => {
      this.forceUpdate();
    }, 500);
  }

  toggle = (forceVal) => {
    this.props.uiToggleDetailView(forceVal);
    window.setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 300);
  };

  //todo - need to provide a way to unregister event handlers (e.g. an un-render() callback)
  loadExtension = (manifest) => {
    try {
      this.toggle(true);
      this.setState({ currentExtension: manifest });

      setTimeout(() => {
        const boundingBox = this.refs.extensionContainer.getBoundingClientRect();
        manifest.render(this.refs.extensionView, {boundingBox});
      });
    } catch (err) {
      console.error('error loading / rendering extension!', manifest);
      throw err;
    }
  };

  render() {
    //todo - trigger more intelligently, dont want to recompute all the time
    const extensions = extensionsByRegion('sequenceDetail');

    const header = (this.props.isVisible) ?
      (
        <div className="ProjectDetail-heading">
          <a className="ProjectDetail-heading-extension visible">{this.state.currentExtension.readable || this.state.currentExtension.name}</a>
          <a ref="close"
             className="ProjectDetail-heading-close"
             onClick={() => this.toggle(false)}/>
        </div>
      ) :
      (
        <div className="ProjectDetail-heading">
          <a ref="open"
             className="ProjectDetail-heading-toggle"
             onClick={() => { this.toggle(); this.loadExtension(extensions[0]);} }/>
          <div className="ProjectDetail-heading-extensionList">
            {extensions.map(manifest => {
              return (
                <a key={manifest.name}
                   className="ProjectDetail-heading-extension"
                   onClick={this.loadExtension.bind(null, manifest)}>{manifest.readable || manifest.name}</a>
              );
            })}
          </div>
        </div>
      );

    return (
      <div className={'ProjectDetail' + (this.props.isVisible ? ' visible' : '')}>
        {header}
        <div className="ProjectDetail-chrome"
             ref="extensionContainer">
          <div ref="extensionView"
               className="ProjectDetail-extensionView"></div>
        </div>

      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  const isVisible = state.ui.detailViewVisible;
  return {
    isVisible,
  };
};

export default connect(mapStateToProps, {
  uiToggleDetailView,
})(ProjectDetail);
