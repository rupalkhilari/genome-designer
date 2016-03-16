var homepageRegister = require('../fixtures/homepage-register');
var signout = require('../fixtures/signout');
var signin = require('../fixtures/signin');
var dragFromTo = require('../fixtures/dragfromto');

module.exports = {
  'Test drag and drop on test project.' : function (browser) {

    // maximize for graphical tests
    browser.windowSize('current', 1200, 900);

    // register via fixture
    var credentials = homepageRegister(browser);

    // now we can go to the project page
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
      // click the second inventory group to open it
      .click('.InventoryListGroup:nth-of-type(2)')
      // expect at least one inventory item and one block to drop on
      .waitForElementPresent('.InventoryItem', 5000, 'expected an inventory item')
      .waitForElementPresent('.sbol-glyph', 5000, 'expected a block to drop on')
      .assert.countelements('.sbol-glyph', 7)

    // drag an item from the inventory
    for(var i = 0; i < 20; i += 1) {
      dragFromTo(
          browser,
          '.InventoryItem:nth-of-type(' + (i + 1) + ')', 10, 10,
          '.sbol-glyph:nth-of-type(1)', 30, 10);
    }

    browser
      .assert.countelements('.sbol-glyph', 27)
      .end();
  }
};
