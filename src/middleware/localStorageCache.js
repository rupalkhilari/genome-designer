import invariant from 'invariant';

const storage = window.localStorage;

export function getItem(id) {
  try {
    return storage.getItem(id);
  } catch (err) {
    console.warn('local storage error getting item'); //eslint-disable-line no-console
    return undefined;
  }
}

export function setItem(id, value) {
  invariant(id, 'id is required to setItem');
  invariant(typeof value === 'string', 'value must be a string');

  try {
    return storage.setItem(id, value);
  } catch (err) {
    console.warn(err); //eslint-disable-line no-console
    return value;
  }
}
