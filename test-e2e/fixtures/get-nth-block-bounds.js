/**
 * get the nth block, within the given selector, bounds in document space
 */
module.exports = function (browser, srcSelector, blockIndex) {

  // generate mouse move events on body from source to destination
  browser.execute(function(srcSelector, blockIndex) {

    var src = document.querySelector(srcSelector);
    var blocks = src.querySelectorAll('.sbol-glyph');
    var block = blocks[blockIndex];
    var target = Math.random().toString(36).substr(5);
    block.setAttribute('data-target', target);
    return target;

  }, [srcSelector, blockIndex], function(result) {

    var target = result.value;
    var selector = '[data-target="' + target + '"]';
    browser
      .assert.countelements(selector, 1)
      .moveTo(selector)
      .mouseButtonDown(0)
      .mouseButtonUp(0);
  });
}
