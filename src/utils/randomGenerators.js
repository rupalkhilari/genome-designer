//todo - realistically, makePart + makeConstruct should probably be part of Models. here temporarily until it has a proper home.
let partCounter = 0;
export function makePart (seqLength = 100) {
  return {
    id      : UUID(),
    metadata: {
      name: 'Part ' + (partCounter++)
    },
    sequence: randomSequence(seqLength),
    color   : randomColor(),
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
    id: UUID,
    metadata  : {
      name: 'My Project'
    },
    components: []
  }
}

/* random gen utils */

//todo - lets pull this out into its own class
export function UUID () {
  var d    = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d     = Math.floor(d / 16);
    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
  return uuid;
}

export function randomColor () {
  return '#' + Math.floor(Math.random() * Math.pow(2, 24)).toString(16);
}

export function randomSequence (length, monomers = 'acgt') {
  let seq   = [],
      monos = monomers.split('');
  for (let i = 0; i < length; i++) {
    let rando = Math.floor(Math.random() * 4);
    seq.push(monos[rando]);
  }
  return seq.join('');
}