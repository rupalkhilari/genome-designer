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

  loadExtension = (manifest) => {
    try {
      manifest.render(this.refs.extensionView);
      this.toggle(true);
    } catch (err) {
      console.error('error loading / rendering extension!', manifest);
      console.error(err);
    }
  };

  render() {
    //todo - trigger more intelligently, dont want to recompute all the time
    const extensions = extensionsByRegion('sequenceDetail');

    return (
      <div className={'ProjectDetail' + (this.props.isVisible ? ' visible' : '')}>
        <div className="ProjectDetail-heading">
          {!this.props.isVisible && (<a ref="open"
                                        className="ProjectDetail-heading-toggle"
                                        onClick={() => { this.toggle(); this.loadExtension(extensions[0]);} }/>)}

          <div className="ProjectDetail-heading-extensionList">
            {extensions.map(manifest => {
              return (
                <a key={manifest.name}
                   className="ProjectDetail-heading-extension"
                   onClick={this.loadExtension.bind(null, manifest)}>{manifest.readable || manifest.name}</a>
              );
            })}

            {!this.props.isVisible && ( <a className="ProjectDetail-heading-extension disabled">3D Protein Preview</a>)}
            {!this.props.isVisible && ( <a className="ProjectDetail-heading-extension disabled">CRISPR</a>)}
          </div>

          {this.props.isVisible && (<a ref="close"
                                       className="ProjectDetail-heading-close"
                                       onClick={() => this.toggle(false)}/>)}
        </div>
        <div className="ProjectDetail-chrome">
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
