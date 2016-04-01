// height of blocks
const blockH = 30;
// width of title
const titleW = 200;
const titleH = 40;
// total height of each row
const rowH = 60;
// row header bar height
const rowBarH = 4;
// vertical bar width
const rowBarW = 4;
// padding around text on blocks
const textPad = 8;
// width of context menu 3 dots
const contextDotsW = 10;
const contextDotsH = 18;
// width of condensed text blocks
const condensedText = 40;
// height of banner bar above construct name
const bannerHeight = 18;
// inset of layout in graph
const insetX = 0;
const insetY = 0;
// inset of nested constructs
const nestedInsetX = 20;
const nestedInsetY = 20;
// font size
const titleFontSize = '20px';
const blockFontSize = '12px';
// background
const background = 'rgb(52, 57, 77)';
// size of sbol icons
const sbolIcon = 27;
// min size of layout
const minWidth = blockH * 4;
const minHeight = blockH;
// padding at bottom of scenegraph to make selection easier
const bottomPad = 20;

export default {
  // layout algorithms
  layoutWrap: 'wrap',
  layoutFit: 'fit',
  layoutFull: 'full',

  // layout metrics
  blockH: blockH,
  contextDotsW: contextDotsW,
  contextDotsH: contextDotsH,
  titleW: titleW,
  titleH: titleH,
  rowH: rowH,
  rowBarH: rowBarH,
  rowBarW: rowBarW,
  textPad: textPad,
  condensedText: condensedText,
  insetX: insetX,
  insetY: insetY,
  nestedInsetX: nestedInsetX,
  nestedInsetY: nestedInsetY,
  bannerHeight: bannerHeight,
  sbolIcon: sbolIcon,
  minWidth: minWidth,
  minHeight: minHeight,
  bottomPad: bottomPad,

  // display properties for various elements
  titleAppearance: {
    fill: 'transparent',
    glyph: 'rectangle',
    strokeWidth: 0,
    fontSize: titleFontSize,
    textAlign: 'left',
    height: titleH,
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
  },
  connectorAppearance: {
    glyph: 'rectangle',
    strokeWidth: 1,
    stroke: 'gray',
    fill: 'whitesmoke',
    fontWeight: 'bold',
    fontSize: blockFontSize,
    color: 'gray',
  },
};
