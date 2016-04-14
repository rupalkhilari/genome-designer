import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { uiToggleDetailView } from '../actions/ui';
import { extensionsByRegion, onRegister } from '../extensions/clientRegistry';
import { throttle } from 'lodash';

import '../styles/ProjectDetail.css';

//save across instances in case tossed + reused
let lastExtension = null;

export class ProjectDetail extends Component {
  static propTypes = {
    uiToggleDetailView: PropTypes.func.isRequired,
    isVisible: PropTypes.bool.isRequired,
    project: PropTypes.object.isRequired,
  };

  state = {
    currentExtension: lastExtension,
    openHeight: 400,
  };

  extensions = [];

  componentWillMount() {
    //e.g. if change project and component completely re-renders
    if (this.props.isVisible) {
      this.setState({ currentExtension: lastExtension });
    }
  }

  componentDidMount() {
    this.extensionsListener = onRegister(() => {
      Object.assign(this, { extensions: extensionsByRegion('sequenceDetail').filter(manifest => manifest.name !== 'simple') });
      this.forceUpdate();
    });
  }

  componentWillUnmount() {
    this.extensionsListener();
  }

  throttledDispatchResize = throttle(() => window.dispatchEvent(new Event('resize')), 50);

  handleResizableMouseDown = evt => {
    evt.preventDefault();
    this.refs.resizeHandle.classList.add('dragging');
    document.addEventListener('mousemove', this.handleResizeMouseMove);
    document.addEventListener('mouseup', this.handleResizeMouseUp);
    this.dragStart = evt.pageY;
    //cringe-worthy query selector voodoo
    this.dragMax = document.querySelector('.ProjectPage-content').getBoundingClientRect().height - 200;
    this.openStart = this.state.openHeight;
  };

  handleResizeMouseMove = evt => {
    evt.preventDefault();
    const delta = this.dragStart - evt.pageY;
    const minHeight = 300;
    const nextHeight = Math.min(this.dragMax, Math.max(minHeight, this.openStart + delta));
    this.setState({ openHeight: nextHeight });
    this.throttledDispatchResize();
  };

  handleResizeMouseUp = evt => {
    evt.preventDefault();
    this.refs.resizeHandle.classList.remove('dragging');
    this.dragStart = null;
    this.openStart = null;
    document.removeEventListener('mousemove', this.handleResizeMouseMove);
    document.removeEventListener('mouseup', this.handleResizeMouseUp);
    window.dispatchEvent(new Event('resize'));
  };

  toggle = (forceVal) => {
    this.props.uiToggleDetailView(forceVal);
    window.setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 300);
  };

  //todo - need to provide a way to unregister event handlers (e.g. an un-render() callback)
  loadExtension = (manifest) => {
    if (!manifest) {
      return;
    }

    try {
      this.toggle(true);
      this.setState({ currentExtension: manifest });
      lastExtension = manifest;

      setTimeout(() => {
        const boundingBox = this.refs.extensionContainer.getBoundingClientRect();
        manifest.render(this.refs.extensionView, { boundingBox });
      });
    } catch (err) {
      console.error('error loading / rendering extension!', manifest);
      throw err;
    }
  };

  render() {
    const header = (this.props.isVisible) ?
      (
        <div className="ProjectDetail-heading">
          <a
            className="ProjectDetail-heading-extension visible">{this.state.currentExtension.readable || this.state.currentExtension.name}</a>
          <a ref="close"
             className="ProjectDetail-heading-close"
             onClick={() => this.toggle(false)}/>
        </div>
      ) :
      (
        <div className="ProjectDetail-heading">
          <a ref="open"
             className="ProjectDetail-heading-toggle"
             onClick={() => {
               this.toggle();
               this.loadExtension(this.extensions[0]);
             }}/>
          <div className="ProjectDetail-heading-extensionList">
            {this.extensions.map(manifest => {
              return (
                <a key={manifest.name}
                   className="ProjectDetail-heading-extension"
                   onClick={() => this.loadExtension(manifest)}>{manifest.readable || manifest.name}</a>
              );
            })}
          </div>
        </div>
      );

    return (
      <div className={'ProjectDetail' + (this.props.isVisible ? ' visible' : '')}
           style={{minHeight: (this.props.isVisible ? `${this.state.openHeight}px` : null)}}>
        {(this.props.isVisible) && (<div ref="resizeHandle"
                                         className="ProjectDetail-resizeHandle"
                                         onMouseDown={this.handleResizableMouseDown}></div>)}
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
