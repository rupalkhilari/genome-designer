import uuid from 'node-uuid';
import React from 'react';
import Node2DReact from '../scenegraph2d_react/node2d';
import Vector2D from '../geometry/vector2d';
import Transform2D from '../geometry/transform2d';

/**
 * shared DIV for measuring text,
 */
let textDIV;

/**
 * basic rectangular node
 */
export default class Node2D {

  constructor(props) {
    // child nodes of this node
    this.children = [];

    // extend default options with the given options
    this.props = Object.assign({
      stroke: 'black',
      strokeWidth: 0,
      fill: 'dodgerblue',
      w: 0,
      h: 0,
      x: 0,
      y: 0,
      r: 0,
      fontSize: '13px',
      fontWeight: 'normal',
      color: 'black',
      scale: 1,
      uuid: uuid.v4(),
    }, props);
  }

  appendChild(child) {
    child.parent = this;
    this.children.push(child);
    return child;
  }

  removeChild(child) {
    throw new Error('Implement');
  }

  set(p) {
    this.props = Object.assign(this.props, p);
  }

  /**
 * get our transform multiplied by our parents, if present, this recursive
 * and works up the child -> parent hierarchy
 * NOTE: This excludes the scene graphs view matrix, generally input points
 * should adjust for that first.
 */
  get transformationMatrix() {
    // use simple caching to save on this calculation
    const key = `${this.props.x},${this.props.y},${this.props.w},${this.props.h},${this.props.scale}`;
    if (this.transformCachedKey !== key) {
      // update cache key
      this.transformCachedKey = key;
      // our local transform
      const T = new Transform2D();
      T.translate = new Vector2D(this.props.x, this.props.y);
      T.translate = new Vector2D(this.props.x, this.props.y);
      T.rotate = this.props.r;
      T.scale = new Vector2D(this.props.scale, this.props.scale);
      this.matrixCached = T.getTransformationMatrix(this.props.w, this.props.h);
    }

    // bring in parent if we have one, otherwise just our matrix
    return this.parent
      ? this.parent.transformationMatrix.multiplyMatrix(this.matrixCached)
      : this.matrixCached.clone();
  }

  /**
   * inverse transformation matrix
   * @return {[type]} [description]
   */
  get inverseTransformationMatrix() {
    return this.transformationMatrix.inverse();
  }

  /**
   * convert a point ( or array of points ) in global ( scene graph space ) to local space
   */
  globalToLocal(p) {
    if (Array.isArray(p)) {
      return p.map( v => {
        return this.globalToLocal(v);
      }, this);
    }
    return this.inverseTransformationMatrix.multiplyVector(p);
  }

  /**
   * convert a point ( or array of points ) in global ( scene graph space ) to local space
   */
  localToGlobal(p) {
    if (Array.isArray(p)) {
      return p.map( v => {
        return this.localToGlobal(v);
      }, this);
    }
    return this.transformationMatrix.multiplyVector(p);
  }

  /**
 * transform point into our local space and return results of containment test
 * @param {Vector2D} p
 * @returns boolean
 */
  containsGlobalPoint(p) {
    // get our inverse transformation matrix including all our parents transforms
    // and use the inverse to put the point into the local space of the
    // node. Then we can just test against the AABB
    const pt = this.globalToLocal(p);
    return pt.x >= 0 && pt.y >= 0 && pt.x <= this.props.w && pt.y <= this.props.h;
  }

  /**
   * uses a global, hidden div to measure the width height of the given string
   * using our current text settings
   * @param  {string} s - string to measure or if ommitted this.props.text
   * @return {Vectot2D}
   */
  measureText(s) {
    // create div on demand
    if (!textDIV) {
      textDIV = document.createElement('DIV');
      textDIV.style.display = 'inline-block';
      textDIV.style.position = 'absolute';
      textDIV.style.padding = 0;
      textDIV.style.visibility = 'hidden';
      document.body.appendChild(textDIV);
    }

    // update to our current font settings and text
    textDIV.innerHTML = s || this.props.text || '';
    textDIV.style.fontSize = this.props.fontSize;
    textDIV.style.fontWeight = this.props.fontWeight;

    // return measurement
    return new Vector2D(textDIV.clientWidth, textDIV.clientHeight);
  }

  render() {
    // get a rendering of all our children, recursively including all their children
    const childrenRendered = this.children.map(child => {
      return child.render();
    });
    return (<Node2DReact key={this.props.uuid} {...this.props}>
      {childrenRendered}
    </Node2DReact>);
  }

}
