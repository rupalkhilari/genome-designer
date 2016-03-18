import invariant from 'invariant';
import StoreHistory from './storeHistory';

//todo - may need to prohibit silent updates in a transaction... how else to reconcile?
/* eslint-disable no-console */

export default class SectionManager {
  constructor(initialState, config = {}) {
    this.history = new StoreHistory(initialState);

    this.transactionDepth = 0;
    this.transactionState = null;

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
      console.log(`SectionManager: patching (not undoable)`, action);
    }

    if (this.transactionDepth > 0) {
      return this.setTransactionState(state);
    }

    this.history.patch(state);
    return this.getCurrentState();
  };

  insert = (state, action) => {
    //if same state, ignore it
    if (state === this.getCurrentState()) {
      return state;
    }

    //todo - verify this is how we want to handle this
    if (this.transactionDepth > 0) {
      return this.setTransactionState(state);
    }

    this.history.insert(state);

    if (this.debug) {
      console.log('SectionManager: updating state' + (this.transactionDepth > 0 ? ' (in transaction)' : ''), action);
    }

    return this.getCurrentState();
  };

  undo = () => {
    if (this.debug) {
      console.log(`SectionManager: undo`);
    }

    this.history.undo();
    this.setTransactionState(null);
    return this.getCurrentState();
  };

  redo = () => {
    if (this.debug) {
      console.log(`SectionManager: redo`);
    }

    this.history.redo();
    this.setTransactionState(null);
    return this.getCurrentState();
  };

  jump = (number) => {
    if (this.debug) {
      console.log(`SectionManager: jump`);
    }

    this.history.jump(number);
    this.setTransactionState(null);
    return this.getCurrentState();
  };

  //doesnt affect transactions, just clear the history
  purge = () => {
    this.history.reset(this.getCurrentState());
  };

  transact = () => {
    this.transactionDepth++;

    if (this.debug) {
      console.group(`SectionManager: Beginning Transaction (depth = ${this.transactionDepth})`);
    }

    this.setTransactionState(this.getPresent());

    return this.getCurrentState();
  };

  commit = () => {
    invariant(this.transactionDepth > 0, 'not in a transaction');
    this.transactionDepth--;

    if (this.debug) {
      console.log('SectionManager: committing transaction. ' +
        (this.transactionDepth === 0 ? 'all transactions complete' : 'nested transaction'));
      console.groupEnd();
    }

    if (this.transactionDepth === 0) {
      this.insert(this.transactionState);
      this.setTransactionState(null);
    }

    return this.getCurrentState();
  };

  abort = () => {
    invariant(this.transactionDepth > 0, 'not in a transaction');

    //todo - need to handle nested transactions... do we just go back to the start of all of them?
    if (this.transactionDepth > 1) {
      console.warn('SectionManager will handle nested transactions with depth greater than one by reverting to the state at start of all transactions, when all of the transactions abort / commit');
    }

    this.transactionDepth--;

    if (this.debug) {
      console.log('SectionManager: aborting transaction. ' +
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
