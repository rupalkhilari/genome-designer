

module.exports = {
  'Test drag and drop on an empty project.' : function (browser) {
    browser
      .url('http://localhost:3000/project/test');
    //   // wait for inventory and inspector to be present
    //   .waitForElementPresent('.SidePanel.Inventory', 5000, 'Expected Inventory Groups')
    //   .waitForElementPresent('.SidePanel.Inspector', 5000, 'Expected Inspector')
    //   // open inventory
    //   .click('.Inventory-trigger')
    //   .waitForElementPresent('.SidePanel.Inventory.visible', 5000, 'Expected inventory to be visible')
    //   // open inspector
    //   .click('.Inspector-trigger')
    //   .waitForElementPresent('.SidePanel.Inspector.visible', 5000, 'Expected inspector to be visible')
    //   // expect at least one inventory item and one block to drop on
    //   .waitForElementPresent('.InventoryItem-item', 5000, 'expected an inventory item')
    //   .waitForElementPresent('[data-testblock]', 5000, 'expected a block to drop on');
    //
    // // count the number of blocks and sbol blocks
    // var blocks, sbolBlocks, total;
    // browser.execute(function() {
    //   return {
    //     blocks: document.querySelectorAll('[data-testblock]').length,
    //     sbol: document.querySelectorAll('[data-testsbol]').length,
    //   }
    // }, [], function(result) {
    //   blocks = result.value.blocks;
    //   sbolBlocks = result.value.sbol;
    //   total = blocks + sbolBlocks;
    //   browser.assert.ok(total === 5, 'expect there to be 5 blocks in the project');
    // });
    //
    // // click and drag first inventory item
    // browser
    //   .moveToElement('.InventoryItem-item', 10, 10)
    //   .mouseButtonDown(0)
    //   .moveToElement('[data-testblock]', 10, 10)
    //   .mouseButtonUp(0);
    //
    // // verify the number of blocks increased
    // browser.execute(function() {
    //   return {
    //     blocks: document.querySelectorAll('[data-testblock]').length,
    //     sbol: document.querySelectorAll('[data-testsbol]').length,
    //   }
    // }, [], function(result) {
    //   blocks = result.value.blocks;
    //   sbolBlocks = result.value.sbol;
    //   browser.assert.ok(blocks + sbolBlocks === total + 1, 'expect there to be 1 more block in the project');
    // });

    browser.end();
  }
};
