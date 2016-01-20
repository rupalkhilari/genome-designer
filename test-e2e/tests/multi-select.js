

module.exports = {
  'Test multi-select on blocks.' : function (browser) {
    browser
      .url('http://localhost:3000/project/test')
      // wait for inventory and inspector to be present
      .waitForElementPresent('.SidePanel.Inventory', 5000, 'Expected Inventory Groups')
      .waitForElementPresent('.SidePanel.Inspector', 5000, 'Expected Inspector');

    // count the number of blocks and sbol blocks and click them all
    var blocks, sbolBlocks, total;
    browser.execute(function() {

      // set global shift click
      window.__e2eShiftKey = 'true';

      var blocks = Array.prototype.slice.call(document.querySelectorAll('[data-testblock]'), 0);

      return {
        blocks: blocks.length,
        sbol: document.querySelectorAll('[data-testsbol]').length,
        blockIDS: blocks.map(function(e) {
          return e.getAttribute('data-testblock');
        }),
      }
    }, [], function(result) {
      blocks = result.value.blocks;
      sbolBlocks = result.value.sbol;
      total = blocks + sbolBlocks;
      browser.assert.ok(total === 5, 'expect there to be 5 blocks in the project');

      // click all blocks with multi-select on
      result.value.blockIDS.forEach(function(id) {
        var selector = `[data-testblock="${id}"]`;
        browser
          .moveToElement(selector, 10, 10)
          .mouseButtonDown(0)
          .mouseButtonUp(0);
      });
    });

    // selection boxes should equal length of Array
    browser.assert.countelements('.scenegraph-userinterface-selection', 2);
    
    browser.end();
  }
};
