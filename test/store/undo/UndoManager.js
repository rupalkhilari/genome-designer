import * as actions from '../../../src/store/undo/actions';

describe('Store', () => {
  describe('Undo', () => {
    describe('UndoManager', () => {
      const manager = new UndoManager();

      it('patch()');
      it('update()');
      it('undo()');
      it('redo()');
      it('ignore()');

      describe('Transactions', () => {
        it('transact()');
        it('getCurrentState() defaults to transaction');
        it('commit()');
        it('abort()');
      });
    });
  });
});
