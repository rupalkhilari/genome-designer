import * as actions from '../../../src/store/undo/actions';

describe('Store', () => {
  describe('Undo', () => {
    describe('reducerEnhancer', () => {
      it('accepts a configuration');
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
