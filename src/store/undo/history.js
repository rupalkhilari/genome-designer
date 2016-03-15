import invariant from 'invariant';

export function createHistory(state) {
  return {
    past: [],
    present: state,
    future: [],
  };
}

export function update(history, newState) {
  const { past, present } = history;
  return {
    past: [
      ...past,
      present,
    ],
    present: newState,
    future: [],
  };
}

export function undo(history) {
  const { past, present, future } = history;

  console.log(past, present, future);

  if (past.length <= 0) {
    console.warn('called undo with no past in history');
    return history;
  }

  return {
    past: past.slice(0, past.length - 1),
    present: past[past.length - 1],
    future: [
      present,
      ...future,
    ],
  };
}

export function redo(history) {
  const { past, present, future } = history;
  if (future.length <= 0) {
    console.warn('called redo with no future in history');
    return history;
  }

  return {
    past: [
      ...past,
      present,
    ],
    present: future[0],
    future: future.slice(1, future.length),
  };
}

export function jump(history, steps) {
  invariant(Number.isNumber(steps) || steps === undefined, 'must pass a number of steps');

  const { past, present, future } = history;

  if (steps === 0) return history;
  if (steps === -1) return undo(history);
  if (steps === 1) return redo(history);

  //todo - check number of steps out

  if (steps < -1) {
    //past
    return {
      past: past.slice(0, steps),
      present: past[steps],
      future: past.slice(steps + 1)
        .concat([present])
        .concat(future),
    };
  }

  //else, future (steps > 1)
  return {
    past: past.concat([present])
      .concat(future.slice(0, steps)),
    present: future[steps],
    future: future.slice(steps + 1),
  };
}
