import Instance from './Instance';
import invariant from '../utils/environment/invariant';
import randomColor from '../utils/generators/color';
import { saveBlock, readFile } from '../middleware/api';
import AnnotationDefinition from '../schemas/Annotation';

const sequenceFilePathFromId = (id) => `block/${id}/sequence/`;

//todo - should scaffold, not pass manually

export default class Block extends Instance {
  constructor(...args) {
    super(...args, {
      metadata: {
        color: randomColor(),
      },
      sequence: {
        annotations: [],
      },
      source: {},
      rules: [],
      options: [],
      components: [],
      notes: {},
    });
  }

  save() {
    return saveBlock(this);
  }

  addComponent(component, index) {
    const spliceIndex = Number.isInteger(index) ? index : this.components.length;
    const newComponents = this.components.slice();
    newComponents.splice(spliceIndex, 0, component);
    return this.mutate('components', newComponents);
  }

  hasSequenceUrl() {
    return (typeof this.sequence === 'object' && (typeof this.sequence.url === 'string') );
  }

  getSequenceUrl(forceNew) {
    return ( forceNew || !this.hasSequenceUrl() ) ?
      sequenceFilePathFromId(this.id) :
      this.sequence.url;
  }

  /**
   * @description Retrieve the sequence of the block. Retrieves the sequence from the server, since it is stored in a file, returning a promise.
   * @param format {String} accepts 'raw', 'fasta', 'genbank'
   * @returns {Promise} Promise which resolves with the sequence value, or (resolves) with null if no sequence is associated.
   */
  getSequence(format = 'raw') {
    //future - url + `?format=${format}`; --- need API support
    const sequencePath = this.getSequenceUrl();

    return !this.hasSequenceUrl() ?
      Promise.resolve(null) :
      readFile(sequencePath)
        .then(resp => resp.text())
        .then(result => {
          return result;
        });
  }

  /**
   * @description Set the sequence URL of the block. Does not affect annotations.
   * ONLY SET THE URL ONCE THE FILE IS WRITTEN SUCCESSFULLY
   * @param url {String} URL of the sequence file. Should generate with block.getSequenceUrl.
   * @returns block {Block} New block with the potentially-updated sequence file path
   */
  setSequenceUrl(url) {
    return this.mutate('sequence.url', url);
  }

  annotate(annotation) {
    invariant(AnnotationDefinition.validate(annotation), `'annotation is not valid: ${annotation}`);
    return this.mutate('sequence.annotations', this.sequence.annotations.concat(annotation));
  }

  removeAnnotation(annotation) {
    const annotationId = typeof annotation === 'object' ? annotation.id : annotation;
    invariant(typeof annotationId === 'string', `Must pass object with ID or annotation ID directly, got ${annotation}`);

    const annotations = this.sequence.annotations.slice();
    const toSplice = annotations.findIndex((ann) => ann.id === annotationId);

    if (!Number.isInteger(toSplice)) {
      console.warn('annotation not found'); // eslint-disable-line
      return this;
    }

    annotations.splice(toSplice, 1);
    return this.mutate('sequence.annotations', annotations);
  }
}
