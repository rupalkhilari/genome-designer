
export default class Node2DText {

  // construct our element and append to parents element
  constructor(node) {
    this.node = node;
    this.el = document.createElement('div');
    this.el.className = 'nodetext';
    this.node.el.appendChild(this.el);
  }

  /**
   * update to our current dimensions styles and innerHTML (text)
   */
  update() {
    this.el.style.width = this.node.width + 'px';
    this.el.style.height = this.el.style.lineHeight = this.node.height + 'px';
    this.el.style.fontWeight = this.node.fontWeight;
    this.el.style.fontSize = this.node.fontSize;
    this.el.style.fontFamily = this.node.fontFamily;
    this.el.style.color = this.node.color;
    this.el.style.textAlign = this.node.textAlign;
    this.el.innerHTML = this.node.text || '';
  }
}
