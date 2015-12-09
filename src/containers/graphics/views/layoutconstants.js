const blockH = 24;
// width of blocks
const blockW = 70;
// width of title
const titleW = 200;
// total height of each row
const rowH = 60;
// row header bar height
const rowBarH = 3;
// vertical bar width
const rowBarW = 3;
// padding around text on blocks
const textPad = 16;
// width of condensed text blocks
const condensedText = 25;
// inset of layout in graph
const insetX = 50;
const insetY = 50;
// font size
const fontSize = '13px';


export default {
  // layout algorithms
  layoutWrap: 'wrap',
  layoutWrapCondensed: 'wrap-condensed',
  layoutFull: 'full',
  layoutFullCondensed: 'full-condensed',

  // layout metrics
  blockH: blockH,
  blockW: blockW,
  titleW: titleW,
  rowH: rowH,
  rowBarH: rowBarH,
  rowBarW: rowBarW,
  textPad: textPad,
  condensedText: condensedText,
  insetX: insetX,
  insetY: insetY,
  // display properties for various elements
  titleAppearance: {
    fill: 'dodgerblue',
    color: 'white',
    glyph: 'rectangle',
    strokeWidth: 0,
    fontSize: fontSize,
  },
  rowAppearance: {
    height: rowBarH,
    fill: 'black',
    glyph: 'rectangle',
    strokeWidth: 0,
  },
  verticalAppearance: {
    width: rowBarW,
    fill: 'black',
    glyph: 'rectangle',
    strokeWidth: 0,
  },
  partAppearance: {
    color: 'black',
    glyph: 'rectangle',
    fontWeight: 'bold',
    strokeWidth: 1,
    fill: 'whitesmoke',
    stroke: 'gray',
    fontSize: fontSize,
    classes: 'transform-animated',
  },
  connectorAppearance: {
    glyph: 'rectangle',
    strokeWidth: 1,
    stroke: 'gray',
    fill: 'whitesmoke',
    fontWeight: 'bold',
    fontSize: '10px',
    color: 'gray',
    classes: 'transform-animated',
  },
};
