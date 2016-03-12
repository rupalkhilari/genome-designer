import invariant from 'invariant';

const storage = window.localStorage;

export function getItem(id) {
  return storage.getItem(id);
}

export function setItem(id, value) {
  invariant(id, 'id is required to setItem');
  invariant(typeof value === 'string', 'value must be a string');

  return storage.setItem(id, value);
}
