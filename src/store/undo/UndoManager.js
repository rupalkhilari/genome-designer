import invariant from 'invariant';
import StoreHistory from './storeHistory';

//todo - may need to prohibit silent updates in a transaction... how else to reconcile?
/* eslint-disable no-console */

export default class UndoManager {
  constructor(initialState, config) {
    this.history = new StoreHistory(initialState);

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

  patch = (state, action) => {
    if (this.debug) {
      //too many updates
      //console.log(`UndoManager: silent update (not undoable)`, action);
    }

    if (this.transactionDepth > 0) {
      this.setTransactionState(state);
      return state;
    }

    this.history.patch(state);
    return this.getCurrentState();
  };

  update = (state, action) => {
    //if same state, ignore it
    if (state === this.getCurrentState()) {
      return state;
    }

    if (this.ignores > 0) {
      this.ignores--;

      if (this.debug) {
        console.log(`UndoManager: ignoring update (ignoring ${this.ignores} more)`);
      }

      return this.patch(state, action);
    }

    //todo - verify this is how we want to handle this
    if (this.transactionDepth > 0) {
      this.setTransactionState(state);
      return state;
    }

    this.history.update(state);

    if (this.debug) {
      console.log('UndoManager: updating state' + (this.transactionDepth > 0 ? ' (in transaction)' : ''), action);
    }

    return this.getCurrentState();
  };

  undo = () => {
    if (this.debug) {
      console.log(`UndoManager: undo`);
    }

    this.history.undo();
    this.setTransactionState(null);
    return this.getCurrentState();
  };

  redo = () => {
    if (this.debug) {
      console.log(`UndoManager: redo`);
    }

    this.history.redo();
    this.setTransactionState(null);
    return this.getCurrentState();
  };

  jump = (number) => {
    if (this.debug) {
      console.log(`UndoManager: jump`);
    }

    this.history.jump(number);
    this.setTransactionState(null);
    return this.getCurrentState();
  };

  //doesnt affect transactions, just clear the history
  purge = () => {
    this.history = new StoreHistory(this.getPresent());
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

    return this.getCurrentState();
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
