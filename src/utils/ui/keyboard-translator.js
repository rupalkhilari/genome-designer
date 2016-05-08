
/**
 * convert keyboard short cuts to a platform specific string
 * All inputs are space separated.
 * The following sequences will translate according to the tables below.
 * The join character will be used to separate the resulting symbols i.e. + on microsoft and nothing on apple
 */

export const microsoft = {
  'ctrl': 'Ctrl',
  'mod': 'Ctrl',
  '⌘': 'Ctrl',
  'option': 'Ctrl',
  'meta': 'Ctrl',
  '^': 'Ctrl',
  'shift': 'Shift',
  '⇧': 'Shift',
  'alt': 'Alt',
  '⌥': 'Alt',
  join: '+',
};

export const apple = {
  'ctrl': '^',
  'mod': '⌘',
  '⌘': '⌘',
  'meta': '⌘',
  '^': '^',
  'shift': '⇧',
  '⇧': '⇧',
  'alt': '⌥',
  'option': '⌥',
  '⌥': '⌥',
  join: '',
};

export function stringToShortcut(str) {
  const table = /Mac|iPod|iPhone|iPad/.test(navigator.platform) ? apple : microsoft;
  return translate(table, str);
}

export function translate(table, str) {
  return str.toLowerCase().split(' ').map(symbol => {
    return table[symbol] ? table[symbol] : symbol.toUpperCase();
  }).join(table.join);
}
