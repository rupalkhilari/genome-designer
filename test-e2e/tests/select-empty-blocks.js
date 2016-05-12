var homepageRegister = require('../fixtures/homepage-register');
var signout = require('../fixtures/signout');
var signin = require('../fixtures/signin');
var dragFromTo = require('../fixtures/dragfromto');
var newProject = require('../fixtures/newproject');
var newConstruct = require('../fixtures/newconstruct');
var clickMainMenu = require('../fixtures/click-main-menu');

module.exports = {
  'Test that we can select empty blocks from the edit menu' : function (browser) {

    // maximize for graphical tests
    browser.windowSize('current', 1200, 900);

    // register via fixture
    var credentials = homepageRegister(browser);

    // now we can go to the project page
    browser
      // wait for inventory and inspector to be present
      .waitForElementPresent('.SidePanel.Inventory', 5000, 'Expected Inventory Groups')
      .waitForElementPresent('.SidePanel.Inspector', 5000, 'Expected Inspector')
      // open inventory
      .click('.Inventory-trigger')
      .waitForElementPresent('.SidePanel.Inventory.visible', 5000, 'Expected inventory to be visible')
      // click the second inventory group 'EGF Parts' to open it
      .click('.InventoryGroup:nth-of-type(2) .InventoryGroup-heading');

    newConstruct(browser);

    // open the role symbols and drag from there to make a new construct with three empty blocks
    browser
      .click('.InventoryGroup:nth-of-type(4) .InventoryGroup-heading')
      .pause(1000);

    dragFromTo(browser, '.InventoryItemRole:nth-of-type(1)', 10, 10, '.construct-viewer:nth-of-type(1) .sceneGraph', 300, 30);
    browser.pause(1000);
    dragFromTo(browser, '.InventoryItemRole:nth-of-type(1)', 10, 10, '.construct-viewer:nth-of-type(1) .sceneGraph', 300, 30);
    browser.pause(1000);
    dragFromTo(browser, '.InventoryItemRole:nth-of-type(1)', 10, 10, '.construct-viewer:nth-of-type(1) .sceneGraph', 300, 30);
    browser.pause(1000);
    // click select empty blocks in main menu
    clickMainMenu(browser, 2, 8);

    browser
      .pause(1000)
      // ensure we have all 3 blocks elements selected
      .assert.countelements(".scenegraph-userinterface-selection", 3)
      .end();
  }
};
