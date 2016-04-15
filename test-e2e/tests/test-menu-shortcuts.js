var homepageRegister = require('../fixtures/homepage-register');
var signout = require('../fixtures/signout');
var signin = require('../fixtures/signin');
var dragFromTo = require('../fixtures/dragfromto');
var newProject = require('../fixtures/newproject');
var newConstruct = require('../fixtures/newconstruct');
var clickMainMenu = require('../fixtures/click-main-menu');

module.exports = {
  'Test menu shortcuts' : function (browser) {

    // maximize for graphical tests
    browser.windowSize('current', 1200, 900);

    // register via fixture
    var credentials = homepageRegister(browser);

    // now we can go to the project page
    browser
      .url('http://localhost:3001/project/test')
      // wait for inventory and inspector to be present
      .waitForElementPresent('.SidePanel.Inventory', 5000, 'Expected Inventory Groups')
      .waitForElementPresent('.SidePanel.Inspector', 5000, 'Expected Inspector')
      // open inventory
      .click('.Inventory-trigger')
      .waitForElementPresent('.SidePanel.Inventory.visible', 5000, 'Expected inventory to be visible')
      // click the second inventory group 'EGF Parts' to open it
      .click('.InventoryGroup:nth-of-type(2) .InventoryGroup-heading');

    // start with a fresh project
    newProject(browser);

    // open the sbol symbols and drag from there to make a new construct with three empty blocks
    browser.click('.InventoryGroup:nth-of-type(4) .InventoryGroup-heading');

    dragFromTo(browser, '.InventoryItem:nth-of-type(1)', 10, 10, '.construct-viewer:nth-of-type(1) .sceneGraph', 300, 30);
    dragFromTo(browser, '.InventoryItem:nth-of-type(1)', 10, 10, '.construct-viewer:nth-of-type(1) .sceneGraph', 300, 30);
    dragFromTo(browser, '.InventoryItem:nth-of-type(1)', 10, 10, '.construct-viewer:nth-of-type(1) .sceneGraph', 300, 30);

    // now send some keyboard shortcuts to select all and cut the blocks.

    // now paste the blocks

    browser
      .keys([browser.Keys.COMMAND, 'a'])
      // ensure we have all 3 blocks elements selected
      .assert.countelements(".scenegraph-userinterface-selection", 3)
      // cut all selected blocks
      .keys([browser.Keys.NULL, browser.Keys.COMMAND, 'x'])
      .pause(1000)
      // expect all selections and blocks to be removed
      .assert.countelements(".scenegraph-userinterface-selection", 0)
      .assert.countelements(".sbol-glyph", 0)
      .end();
  }
};
