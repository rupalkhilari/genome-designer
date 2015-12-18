export const colors = [
  '#e7aaa9',
  '#D28482',
  '#E9BA9b',
  '#efac7e',
  '#EFD79A',
  '#F1D26C',
  '#E4E480',
  '#D3D34F',
  '#9CC6C0',
  '#6DA19C',
  '#B1CED0',
  '#65AAB1',
  '#8EC78D',
  '#53B15F',
  '#C5C4C1',
  '#A5A6A2',
];

let lastIndex = 0;
export default function color() {
  const next = colors[lastIndex];
  lastIndex = (lastIndex + 1) % colors.length;
  return next;
}

export function randomColor() {
  return '#' + Math.floor(Math.random() * Math.pow(2, 24)).toString(16);
}
