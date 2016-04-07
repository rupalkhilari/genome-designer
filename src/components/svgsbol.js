import React, { Component, PropTypes } from 'react';
import symbols from '../inventory/sbol';
import { setAttribute } from '../containers/graphics/utils';

const serializer = new XMLSerializer();

export default class SvgSbol extends Component {

  render() {

    if (!this.markup) {

      // clone the template
      const templateId = `sbol-svg-${this.props.symbolName}`;
      const svg = document.getElementById(templateId).cloneNode(true);
      // ensure svg is stroked in black
      setAttribute(svg, 'stroke', this.props.color, true);
      // remove the ID attribute from the clone to avoid duplicates
      svg.removeAttribute('id');
      // set width on top level SVG element
      svg.setAttribute('width', this.props.width);
      svg.setAttribute('height', this.props.height);
      // if the owner wants to modify the stroke width apply
      if (this.props.stroke) {
        setAttribute(svg, 'stroke-width', this.props.stroke, true);
      }

      this.markup = serializer.serializeToString(svg);
    }

    const style={
      width: this.props.width + 'px',
      height: this.props.height + 'px',
      display: 'inline-block',
    }

    return <div style={style} dangerouslySetInnerHTML={{__html: this.markup}}/>

  }
}
