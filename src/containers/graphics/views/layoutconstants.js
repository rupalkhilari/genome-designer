const blockH = 24;
// width of blocks
const blockW = 70;
// width of title
const titleW = 200;
// total height of each row
const rowH = 60;
// row header bar height
const rowBarH = 4;
// vertical bar width
const rowBarW = 3;
// padding around text on blocks
const textPad = 16;
// width of condensed text blocks
const condensedText = 40;
// height of banner bar above construct name
const bannerHeight = 20;
// inset of layout in graph
const insetX = 0;
const insetY = bannerHeight;
// font size
const titleFontSize = '20px';
const blockFontSize = '12px';
// minimum width for layouts
const minWidth = 400;
// background
const background = 'rgb(39, 43, 61)';


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
  minWidth: minWidth,
  bannerHeight: bannerHeight,

  // display properties for various elements
  titleAppearance: {
    fill: 'transparent',
    glyph: 'rectangle',
    strokeWidth: 0,
    fontSize: titleFontSize,
    textAlign: 'left',
  },
  // row bar
  rowAppearance: {
    height: rowBarH,
    glyph: 'rectangle',
    strokeWidth: 0,
  },
  verticalAppearance: {
    width: rowBarW,
    glyph: 'rectangle',
    strokeWidth: 0,
  },
  partAppearance: {
    color: 'black',
    glyph: 'rectangle',
    fontWeight: 'bold',
    strokeWidth: 1,
    stroke: background,
    fontSize: blockFontSize,
    classes: 'transform-animated',
  },
  connectorAppearance: {
    glyph: 'rectangle',
    strokeWidth: 1,
    stroke: 'gray',
    fill: 'whitesmoke',
    fontWeight: 'bold',
    fontSize: blockFontSize,
    color: 'gray',
    classes: 'transform-animated',
  },
};
