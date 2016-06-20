import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { uiToggleDetailView, detailViewSelectExtension } from '../actions/ui';
import { focusDetailsExist } from '../selectors/focus';
import { extensionsByRegion, onRegister } from '../extensions/clientRegistry';
import { throttle } from 'lodash';

import '../styles/ProjectDetail.css';

export class ProjectDetail extends Component {
  static propTypes = {
    uiToggleDetailView: PropTypes.func.isRequired,
    detailViewSelectExtension: PropTypes.func.isRequired,
    focusDetailsExist: PropTypes.func.isRequired,
    isVisible: PropTypes.bool.isRequired,
    currentExtension: PropTypes.object,
    project: PropTypes.object.isRequired,
  };

  state = {
    openHeight: 400,
  };

  extensionRendered = false;
  extensions = [];

  componentDidMount() {
    this.extensionsListener = onRegister(() => {
      Object.assign(this, { extensions: extensionsByRegion('sequenceDetail') });
      if (!this.props.currentExtension && this.extensions.length) {
        this.setCurrentExtension(this.extensions[0]);
      }
    });
  }

  componentWillUnmount() {
    this.extensionsListener();
  }

  setCurrentExtension(manifest) {
    this.props.detailViewSelectExtension(manifest);
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

  handleClickToggle = evt => {
    if (this.props.focusDetailsExist()) {
      this.toggle();
      this.loadExtension(this.extensions[0]);
    }
  };

  toggle = (forceVal) => {
    const detailsAvailable = this.props.focusDetailsExist();
    this.props.uiToggleDetailView(detailsAvailable && forceVal);
    window.setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 300);
  };

  //todo - need to provide a way to unregister event handlers (e.g. an un-render() callback) to the extension
  loadExtension = (manifest) => {
    if (!manifest) {
      return;
    }

    this.toggle(true);
    this.extensionRendered = false;
    this.setCurrentExtension(manifest);
  };

  renderCurrentExtension() {
    const { currentExtension } = this.props;

    if (!currentExtension) {
      return;
    }

    try {
      setTimeout(() => {
        const boundingBox = this.refs.extensionContainer.getBoundingClientRect();
        currentExtension.render(this.refs.extensionView, { boundingBox });
        this.extensionRendered = true;
      });
    } catch (err) {
      console.error('error loading / rendering extension!', currentExtension);
      throw err;
    }
  }

  render() {
    const { isVisible, currentExtension } = this.props;
    const detailsExist = this.props.focusDetailsExist();

    if (isVisible && currentExtension && !this.extensionRendered) {
      this.renderCurrentExtension();
    }

    const header = (isVisible && currentExtension) ?
      (
        <div className="ProjectDetail-heading">
          <a
            className="ProjectDetail-heading-extension visible">{currentExtension.readable || currentExtension.name}</a>
          <a ref="close"
             className={'ProjectDetail-heading-close' + (!detailsExist ? ' disabled' : '')}
             onClick={() => this.toggle(false)}/>
        </div>
      ) :
      (
        <div className="ProjectDetail-heading">
          <a ref="open"
             className="ProjectDetail-heading-toggle"
             onClick={this.handleClickToggle}/>
          <div className="ProjectDetail-heading-extensionList">
            {this.extensions.map(manifest => {
              return (
                <a key={manifest.name}
                   className={'ProjectDetail-heading-extension' + (!detailsExist ? ' disabled' : '')}
                   onClick={() => detailsExist && this.loadExtension(manifest)}>{manifest.readable || manifest.name}</a>
              );
            })}
          </div>
        </div>
      );

    return (
      <div className={'ProjectDetail' + (isVisible ? ' visible' : '')}
           style={{minHeight: (isVisible ? `${this.state.openHeight}px` : null)}}>
        {(isVisible) && (<div ref="resizeHandle"
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
  const { isVisible, currentExtension } = state.ui.detailView;
  const { constructId, forceBlocks, blockIds } = state.focus; //to force rendering (check for if details exist) on focus change
  return {
    isVisible,
    currentExtension,
    blockIds,
    constructId,
    forceBlocks,
  };
};

export default connect(mapStateToProps, {
  uiToggleDetailView,
  detailViewSelectExtension,
  focusDetailsExist,
})(ProjectDetail);
