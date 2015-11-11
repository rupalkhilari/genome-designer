import Instance from './Instance';

import generateColor from '../utils/generators/color';
import generateSequence from '../utils/generators/sequence';

export default class Part extends Instance {
  constructor(forceId, seqLength = 100) {
    super(forceId);

    Object.assign(this, {
      sequence: generateSequence(seqLength),
      color: generateColor(),
      features: [],
    });
  }
}
