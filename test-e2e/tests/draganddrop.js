

module.exports = {
  'Test drag and drop on an empty project.' : function (browser) {
    browser
      .url('http://localhost:3000/project/test')
      // wait for inventory and inspector to be present
      .waitForElementPresent('.SidePanel.Inventory', 5000, 'Expected Inventory Groups')
      .waitForElementPresent('.SidePanel.Inspector', 5000, 'Expected Inspector')
      // open inventory
      .click('.Inventory-trigger')
      .waitForElementPresent('.SidePanel.Inventory.visible', 5000, 'Expected inventory to be visible')
      // open inspector
      .click('.Inspector-trigger')
      .waitForElementPresent('.SidePanel.Inspector.visible', 5000, 'Expected inspector to be visible')
      // expect at least one inventory item and one block to drop on
      .waitForElementPresent('.InventoryItem-item', 5000, 'expected an inventory item')
      .waitForElementPresent('[data-testblock]', 5000, 'expected a block to drop on')
      // click and drag first inventory item
      .moveToElement('.InventoryItem-item', 10, 10)
      .mouseButtonDown(0)
      .pause(500)
      .moveToElement('[data-testblock]', 10, 10)
      .pause(500)
      .mouseButtonUp(0)
      .pause(10000)
      .end();
  }
};
