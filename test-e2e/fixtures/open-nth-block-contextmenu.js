/**
 * get the nth block, within the given selector, bounds in document space
 */
module.exports = function (browser, srcSelector, blockIndex) {

  // generate mouse move events on body from source to destination
  browser.execute(function(srcSelector, blockIndex) {

    var src = document.querySelector(srcSelector);
    var blocks = src.querySelectorAll('.sbol-glyph');
    var block = blocks[blockIndex];
    return block.getBoundingClientRect();

  }, [srcSelector, blockIndex], function(result) {
    var b = result.value;
    browser
      .moveToElement('body', b.left + b.width - 10, b.top + 10)
      .mouseButtonDown(0)
      .mouseButtonUp(0);
  });
}
