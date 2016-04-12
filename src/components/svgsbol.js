import React, { Component, PropTypes } from 'react';
import symbols from '../inventory/sbol';
import { setAttribute } from '../containers/graphics/utils';
import invariant from 'invariant';

const serializer = new XMLSerializer();

export default class SvgSbol extends Component {

  render() {

    if (!this.markup) {

      // clone the template
      const templateId = `sbol-svg-${this.props.symbolName}`;
      const template = document.getElementById(templateId);
      invariant(template, 'missing SVG template for sbol symbol:' + this.props.symbolName);
      const svg = template.cloneNode(true);
      // ensure svg is stroked in black
      setAttribute(svg, 'stroke', this.props.color || 'white', true);
      // remove the ID attribute from the clone to avoid duplicates
      svg.removeAttribute('id');
      // set width on top level SVG element
      if (this.props.width) {
        svg.setAttribute('width', this.props.width);
      }
      if (this.props.height) {
        svg.setAttribute('height', this.props.height);
      }
      // if the owner wants to modify the stroke width apply
      if (this.props.stroke) {
        setAttribute(svg, 'stroke-width', this.props.stroke, true);
      }
      this.markup = serializer.serializeToString(svg);
    }

    const style={
      display: 'inline-block',
    };
    if (this.props.width) {
      style.width = this.props.width + 'px';
    }
    if (this.props.height) {
      style.height = this.props.height + 'px';
    }

    return <div style={style} dangerouslySetInnerHTML={{__html: this.markup}}/>

  }
}
