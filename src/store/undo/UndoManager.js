import invariant from 'invariant';
import TransactionManager from './SectionManager';

export default class UndoManager {
  constructor(config = {}) {
    this.slaves = {};

    //dont want a storeHistory because no present necessary
    this.past = [];
    this.future = [];

    this.lastAction = null;

    this.transactionDepth = 0;
  }

  register(key, transactionManager) {
    invariant(transactionManager instanceof TransactionManager, 'must pass TransactionManager');
    Object.assign(this.slaves, { [key]: transactionManager });
  }

  assignLastAction(action) {
    this.lastAction = action;
  }

  doOnce = (action, func) => {
    if (action === this.lastAction) return;
    this.assignLastAction(action);
    func();
  };

  addHistoryItem(key, action) {
    const payload = {
      key,
      action,
      time: +(new Date()),
    };
    this.past.push(payload);

    //purge the history once you make an insertion (like StoreHistory)
    this.future.length = 0;
  }

  getLastHistoryItem() {
    const pastLength = this.past.length;
    return pastLength ? this.past[pastLength - 1] : null;
  }

  getFirstFutureItem() {
    return this.future.length ? this.future[0] : null;
  }

  insert = (key, state, action) => this.doOnce(action, () => {
    this.addHistoryItem(key, action);
    this.slaves[key].insert(state, action);
  });

  patch = (key, state, action) => this.doOnce(action, () => {
    this.slaves[key].patch(state, action);
  });

  purge = (action) => this.doOnce(action, () => {
    //reset past and future
    this.past.length = 0;
    this.future.length = 0;

    //clean up slaves (not technically necessary, but for GC)
    Object.keys(this.slaves).forEach(key => this.slaves[key].purge());
  });

  undo = (action) => this.doOnce(action, () => {
    const lastItem = this.getLastHistoryItem();
    if (lastItem) {
      this.slaves[lastItem.key].undo();
      this.future.unshift(this.past.pop());
    }
  });

  redo = (action) => this.doOnce(action, () => {
    const nextItem = this.getFirstFutureItem();
    if (nextItem) {
      this.slaves[nextItem.key].redo();
      this.past.push(this.future.shift());
    }
  });

  jump = (number, action) => this.doOnce(action, () => {
    invariant(false, 'jump not yet implemented');
  });

  //transactions are just delegated to section reducers to handle

  transact = (action) => this.doOnce(action, () => {
    Object.keys(this.slaves).forEach(key => this.slaves[key].transact());
  });

  commit = (action) => this.doOnce(action, () => {
    Object.keys(this.slaves).forEach(key => this.slaves[key].commit());
  });

  abort = (action) => this.doOnce(action, () => {
    Object.keys(this.slaves).forEach(key => this.slaves[key].abort());
  });

  getCurrentState() {
    const lastItem = this.getLastHistoryItem();
    return {
      past: this.past.length,
      future: this.future.length,
      time: lastItem ? lastItem.time : +(new Date()),
    };
  }
}
