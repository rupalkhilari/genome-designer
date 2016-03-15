import invariant from 'invariant';
import * as history from './history';

/* eslint-disable no-console */

export default class UndoManager {
  constructor(config) {
    this.history = history.createHistory();

    this.transactionDepth = 0;

    this.ignores = 0;

    this.limit = config.limit;
    this.debug = config.debug;
  }

  getPresent = () => this.history.present;
  getPast = () => this.history.past;
  getFuture = () => this.history.future;

  update = (state) => {
    //if same state, ignore it
    if (state === this.history.present) {
      return state;
    }

    if (this.ignores > 0) {
      this.ignores--;
      if (this.debug) {
        console.log(`UndoManager: ignoring update (ignoring ${this.ignores} more)`);
      }
      return state;
    }

    //todo - verify this is correct. Should update the store, but not save state here.
    if (this.transactionDepth > 0) {
      return state;
    }

    this.history = history.update(this.history, state);

    if (this.debug) {
      console.log('UndoManager: updating state' + (this.transactionDepth > 0 ? ' (in transaction)' : ''));
      console.groupEnd();
    }

    return this.getPresent();
  };

  undo = () => {
    this.history = history.undo(this.history);
    return this.getPresent();
  };

  redo = () => {
    this.history = history.redo(this.history);
    return this.getPresent();
  };

  jump = (number) => {
    this.history = history.jump(this.history, number);
    return this.getPresent();
  };

  ignore = (steps) => {
    this.ignores = steps === null ? 0 : this.ignores + steps;
    if (this.debug) {
      console.log(`UndoManager: set to ignore ${this.ignores} updates`);
    }
    return this.ignores;
  };

  transact = () => {
    this.transactionDepth++;

    //todo

    if (this.debug) {
      console.group(`UndoManager: Beginning Transaction (depth = ${this.transactionDepth})`);
    }
  };

  commit = () => {
    invariant(this.transactionDepth > 0, 'not in a transaction');
    this.transactionDepth--;

    if (this.transactionDepth === 0) {
      //todo
    }

    if (this.debug) {
      console.log('UndoManager: committing transaction. ' +
        (this.transactionDepth === 0 ? 'all transactions complete' : 'nested transaction'));
      console.groupEnd();
    }

    return this.getPresent();
  };

  abort = () => {
    invariant(this.transactionDepth > 0, 'not in a transaction');
    this.transactionDepth--;

    //todo - do we want to abort the whole transaction? or what degree? how to reference where to go back to?

    if (this.debug) {
      console.log('UndoManager: aborting transaction. ' +
        (this.transactionDepth === 0 ? 'all transactions complete' : 'nested transaction'));
      console.groupEnd();
    }

    return this.getPresent();
  };

  inTransaction = () => (this.transactionDepth > 0);
}

/* eslint-enable no-console */
