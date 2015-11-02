import generateColor from './generators/color';
import generateSequence from './generators/sequence';
import UUID from './generators/UUID';

//todo - these should exist in /schemas/ where each schema creates a scaffold, e.g. from fields

let partCounter = 0;
export function makePart (seqLength = 100) {
  return {
    id      : UUID(),
    metadata: {
      name: 'Part ' + (partCounter++)
    },
    sequence: generateSequence(seqLength),
    color   : generateColor(),
    features: []
  }
}

let constructCounter = 0;
export function makeConstruct (...partLengths) {
  return {
    id        : UUID(),
    metadata  : {
      name: 'Construct ' + (constructCounter++)
    },
    components: partLengths.map(makePart)
  };
}

export function makeProject (UUID) {
  return {
    id        : UUID,
    metadata  : {
      name: 'My Project'
    },
    components: []
  }
}