const colors = [
  //orange
  '#F3C8A8',
  '#F2BD92',
  '#F3A56B',
  //red
  '#F3A2A2',
  '#E28D8B',
  '#D37576',
  //gold
  '#F2E196',
  '#EFD568',
  '#E3C54C',
  //yellow
  '#F2EB91',
  '#E8E557',
  '#D3CC3C',
  //spring
  '#A6CF8E',
  '#90C579',
  '#72AA5A',
  //green
  '#88C16C',
  '#61B44B',
  '#509F37',
  //robin
  '#DDE8EC',
  '#C0DAE2',
  '#A8D3E1',
  //blue
  '#85C8D3',
  '#68B3C4',
  '#58A4B0',
  //turquoise
  '#94C6C3',
  '#76ACAC',
  '#598C8A',

  //red-grey
  '#B7B5B3',
  '#AFA7A1',
  '#8E8785',
  //grey
  '#D8D9D8',
  '#B8B6B5',
  '#848484',
  //yellow-grey
  '#EEEBE7',
  '#D3D2D1',
  '#AAA9A9',
];

let lastIndex = 0;
export default function color() {
  //only get the middle item within a color-range of three
  lastIndex = (lastIndex + 1) % (colors.length / 3);
  const nextMiddle = (lastIndex * 3) + 1;
  return colors[nextMiddle];
}

export function trulyRandomColor() {
  return '#' + Math.floor(Math.random() * Math.pow(2, 24)).toString(16);
}
