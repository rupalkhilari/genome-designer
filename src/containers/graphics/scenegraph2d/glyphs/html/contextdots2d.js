/*
Copyright 2016 Autodesk,Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import Glyph2D from '../glyph2d';
import kT from '../../../views/layoutconstants';


export default class ContextDots2D extends Glyph2D {

  /**
   * draws three centered dots, vertically aligned within our bounds
   */
  constructor(node) {
    super(node);
    this.el = document.createElement('div');
    this.el.className = 'dot-container';
    this.dots = [];
    for (let i = 0; i < 3; i += 1) {
      const dot = document.createElement('div');
      dot.className = 'dot';
      this.el.appendChild(dot);
      this.dots.push(dot);
    }
    this.node.el.appendChild(this.el);
  }

  /**
   * render latest changes
   */
  update() {
    // position and size at right edge of parent
    this.el.style.left = (this.node.width - kT.contextDotsW) + 'px';
    this.el.style.top = '0px';
    this.el.style.width = this.node.width + 'px';
    this.el.style.height = this.node.height + 'px';
    this.dots.forEach(dot => {
      dot.style.backgroundColor = this.node.dotColor || 'black';
    });
  }
}
