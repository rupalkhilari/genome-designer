export const colorMap = {
  '#e7aaa9': 'pink',
  '#D28482': 'red',
  '#E9BA9b': 'tangerine',
  '#efac7e': 'orange',
  '#EFD79A': 'gold',
  '#F1D26C': 'yellow',
  '#E4E480': 'sassafras',
  '#D3D34F': 'yellow green',
  '#9CC6C0': 'cerulean',
  '#6DA19C': 'teal',
  '#B1CED0': 'baby blue',
  '#65AAB1': 'blue',
  '#8EC78D': 'spring',
  '#53B15F': 'green',
  '#C5C4C1': 'light grey',
  '#A5A6A2': 'grey',
};

export const colors = Object.keys(colorMap);

let lastIndex = 0;
export default function color() {
  const next = colors[lastIndex];
  lastIndex = (lastIndex + 1) % colors.length;
  return next;
}

export function randomColor() {
  return '#' + Math.floor(Math.random() * Math.pow(2, 24)).toString(16);
}
