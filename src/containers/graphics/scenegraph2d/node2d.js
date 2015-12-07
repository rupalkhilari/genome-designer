import uuid from 'node-uuid';
import React from 'react';
import Node2DReact from '../scenegraph2d_react/node2d';
import Vector2D from '../geometry/vector2d';
import Box2D from '../geometry/box2d';
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

  /**
   * append the given child to us. It will be top most until another child is added
   * @param  {[type]} child [description]
   * @return {[type]}       [description]
   */
  appendChild(child) {
    child.parent = this;
    this.children.push(child);
    return child;
  }

  /**
   * prepend a child to us. It will be below all other children.
   * @param  {[type]} child [description]
   * @return {[type]}       [description]
   */
  prependChild(child) {
    child.parent = this;
    this.children.unshift(child);
    return child;
  }

  /**
   * remove the given child from our children
   * @param  {[type]} child [description]
   * @return {[type]}       [description]
   */
  removeChild(child) {
    child.parent = null;
    this.children.splice(this.children.indexOf(child), 1);
    return child;
  }

  /**
   * bring to front of parents children stack
   */
  bringToFront() {
    this.parent.removeChild(this);
    this.parent.appendChild(this);
  }

  /**
   * send node to back of its parent child list
   */
  sendToBack() {
    this.parent.removeChild(this);
    this.parent.prependChild(this);
  }

  /**
   * apply the properties of the object p to our props.
   * @param {object} p - key / value pairs of properties
   */
  set(p) {
    Object.keys(p).forEach(key => {

      // value associated with key
      const value = p[key];

      switch (key) {

        case 'bounds':
          this.props.x = value.cx;
          this.props.y = value.cy;
          this.props.w = value.w;
          this.props.h = value.h;
        break;

        // default behaviour is to just set the property
        default: this.props[key] = p[key];
      }
    });
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

  /**
  * get the axis align bounding box for the element
  * @returns G.Box
  */
  getAABB() {

    // transform the 4 corners of the bounds into screen space
    const pts = [
      new Vector2D(0, 0),
      new Vector2D(this.props.w, 0),
      new Vector2D(this.props.w, this.props.h),
      new Vector2D(0, this.props.h),
    ];

    const tpts = pts.map(p => this.transformationMatrix.multiplyVector(p));

    const xmin = Math.min(tpts[0].x, tpts[1].x, tpts[2].x, tpts[3].x);
    const ymin = Math.min(tpts[0].y, tpts[1].y, tpts[2].y, tpts[3].y);
    const xmax = Math.max(tpts[0].x, tpts[1].x, tpts[2].x, tpts[3].x);
    const ymax = Math.max(tpts[0].y, tpts[1].y, tpts[2].y, tpts[3].y);

    return new Box2D(xmin, ymin, xmax - xmin, ymax - ymin);

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
