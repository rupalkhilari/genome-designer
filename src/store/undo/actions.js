import * as ActionTypes from './ActionTypes';

export const undo = () => ({
  type: ActionTypes.UNDO,
});

export const redo = () => ({
  type: ActionTypes.REDO,
});

export const jump = (number) => ({
  type: ActionTypes.JUMP,
  number,
});

export const transact = () => ({
  type: ActionTypes.TRANSACT,
});

export const commit = () => ({
  type: ActionTypes.COMMIT,
});

export const abort = () => ({
  type: ActionTypes.ABORT,
});
