import invariant from 'invariant';
import * as history from './history';

/*
 * U = update()
 * T = transact()
 * C = commit()
 *
 *                     U  T  U   U U     C   U
 *                        |              |
 *                   --1--|--2---3-4-----|---5----
 *
 *  history.present:   1  1  1   1 1     4   5
 * transactionState:   -  1  2   3 4     -   -
 * transactionDepth:   0  1  1   1 1     0   0
 */

/* eslint-disable no-console */

export default class UndoManager {
  constructor(config) {
    this.history = history.createHistory();

    this.transactionDepth = 0;
    this.transactionState = null;

    this.ignores = 0;

    this.debug = config.debug;
  }

  getCurrentState = () => {
    return (!!this.transactionState) ?
      this.transactionState :
      this.history.present;
  };

  getPresent = () => this.history.present;
  getPast = () => this.history.past;
  getFuture = () => this.history.future;

  setTransactionState = (state) => {
    this.transactionState = state;
    return this.transactionState;
  };

  update = (state, action) => {
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

    //todo - verify this is correct.
    if (this.transactionDepth > 0) {
      this.setTransactionState(state);
      return state;
    }

    this.history = history.update(this.history, state);

    if (this.debug) {
      console.log('UndoManager: updating state' + (this.transactionDepth > 0 ? ' (in transaction)' : ''), action);
      console.groupEnd();
    }

    return this.getCurrentState();
  };

  undo = () => {
    this.history = history.undo(this.history);
    this.setTransactionState(null);
    return this.getCurrentState();
  };

  redo = () => {
    this.history = history.redo(this.history);
    this.setTransactionState(null);
    return this.getCurrentState();
  };

  jump = (number) => {
    this.history = history.jump(this.history, number);
    this.setTransactionState(null);
    return this.getCurrentState();
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

    if (this.debug) {
      console.group(`UndoManager: Beginning Transaction (depth = ${this.transactionDepth})`);
    }

    this.setTransactionState(this.getPresent());
  };

  commit = () => {
    invariant(this.transactionDepth > 0, 'not in a transaction');
    this.transactionDepth--;

    if (this.debug) {
      console.log('UndoManager: committing transaction. ' +
        (this.transactionDepth === 0 ? 'all transactions complete' : 'nested transaction'));
      console.groupEnd();
    }

    if (this.transactionDepth === 0) {
      this.update(this.transactionState);
      this.setTransactionState(null);
    }

    return this.getPresent();
  };

  abort = () => {
    invariant(this.transactionDepth > 0, 'not in a transaction');

    //todo - need to handle nested transactions... do we just go back to the start of all of them?
    if (this.transactionDepth > 1) {
      console.warn('UndoManager will handle nested transactions with depth greater than one by reverting to the state at start of all transactions, when all of the transactions abort / commit');
    }

    this.transactionDepth--;

    if (this.debug) {
      console.log('UndoManager: aborting transaction. ' +
        (this.transactionDepth === 0 ? 'all transactions complete' : 'nested transaction'));
      console.groupEnd();
    }

    if (this.transactionDepth === 0) {
      this.setTransactionState(null);
    }

    return this.getPresent();
  };

  inTransaction = () => (this.transactionDepth > 0);
}

/* eslint-enable no-console */
