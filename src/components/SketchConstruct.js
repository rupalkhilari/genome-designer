import React, { Component, PropTypes } from 'react';
import * as SchemaTypes from '../schemas/validators';

import SketchBlock from './SketchBlock';

/**
 @name SketchConstruct
 @description SketchConstruct is the parent element for drawing a construct.

 */

export default class SketchConstruct extends Component {
  constructor (props) {
    super(props);
  }

  state = {
    construct: {
      components: [100, 500, 300].map(makePart)
    }
  }

  static propTypes = {
    //alignOn: SchemaTypes.id() //future, just an example property
  };

  render () {

    //todo - verify components is defined
    let {components} = this.state.construct;
    console.log(components);

    return (
      <svg>
        <g ref="componentsGroup">
          {components.map(comp => {
            return <SketchBlock block={comp}/>
          })}
        </g>
      </svg>
    );
  }
}

//todo - these should be reusable utils

function makePart (seqLength) {
  return {
    id      : UUID(),
    metadata: {
      name: 'My Part'
    },
    sequence: randomSequence(seqLength),
    color   : randomColor(),
    features: []
  }
}

function UUID () {
  var d    = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d     = Math.floor(d / 16);
    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
  return uuid;
}

function randomColor () {
  return '#' + Math.floor(0.234234 * Math.pow(2, 24)).toString(16);
}

function randomSequence (length) {
  let seq   = [],
      monos = 'acgt'.split('');
  for (let i = 0; i < length; i++) {
    let rando = Math.floor(Math.random() * 4);
    seq.push(monos[rando]);
  }
  return seq.join('');
}