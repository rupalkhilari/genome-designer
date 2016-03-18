import {expect, assert} from 'chai';
import UndoManager from '../../../src/store/undo/UndoManager';
import SectionManager from '../../../src/store/undo/SectionManager';

describe('Store', () => {
  describe('Undo', () => {
    describe('UndoManager', () => {
      const manager = new UndoManager();

      const initialStateA = { first: 'state' };
      const sectionManagerA = new SectionManager(initialStateA);
      manager.register('A', sectionManagerA);

      const initialStateB = { second: 'alternate' };
      const sectionManagerB = new SectionManager(initialStateB);
      manager.register('B', sectionManagerB);

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
