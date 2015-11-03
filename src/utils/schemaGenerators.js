import generateColor from './generators/color';
import generateSequence from './generators/sequence';
import UUID from './generators/UUID';

//todo - these should exist in /schemas/ where each schema creates a scaffold, e.g. from fields

let partCounter = 0;
export function makePart (forceId = UUID(), seqLength = 100) {
  return {
    id      : forceId,
    metadata: {
      name: 'Part ' + (partCounter++),
      authors: [],
      tags: {}
    },
    sequence: generateSequence(seqLength),
    color   : generateColor(),
    features: []
  }
}

let blockCounter = 0;
export function makeBlock (forceId = UUID()) {
  return {
    id        : forceId,
    metadata  : {
      name: 'Construct ' + (blockCounter++),
      authors: [],
      tags: {}
    },
    components: []
  };
}

export function makeProject (forceId = UUID()) {
  return {
    id        : forceId,
    metadata  : {
      name: 'My Project',
      authors: [],
      tags: {}
    },
    components: []
  }
}