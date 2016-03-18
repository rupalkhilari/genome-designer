import {expect, assert} from 'chai';
import { undoReducerEnhancerCreator } from '../../../src/store/undo/reducerEnhancer';

describe('Store', () => {
  describe('Undo', () => {
    describe('reducerEnhancer', () => {
      const undoReducerEnhancer = undoReducerEnhancerCreator();

      it('accepts a configuration', () => {
        expect(typeof undoReducerEnhancerCreator).to.equal('function');
        expect(undoReducerEnhancerCreator.bind({config: 'stuff'})).to.not.throw();
        expect(undoReducerEnhancer).to.equal('function');
      });

      it(`doesnt affect the store on its own`);
      it(`makes updates when an action has the field 'undoable'`);
      it('patches on non-undoable actions');
      it('catches undo actions');
      it('catches redo actions');
      it('catches transaction actions');

      it('resets on some actions e.g. route change');

      describe('State Management', () => {
        it('reverts properly between undoable / not undoable actions')
      });
    });
  });
});
