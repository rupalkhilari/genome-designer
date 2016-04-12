var homepageRegister = require('../fixtures/homepage-register');
var signout = require('../fixtures/signout');
var signin = require('../fixtures/signin');
var dragFromTo = require('../fixtures/dragfromto');
var newProject = require('../fixtures/newproject');
var newConstruct = require('../fixtures/newconstruct');
var openNthBlockContextMenu = require('../fixtures/open-nth-block-contextmenu');
var clickNthContextMenuItem = require('../fixtures/click-popmenu-nth-item');

module.exports = {
  'Test that you can delete blocks from the block context menu.' : function (browser) {

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
      // click the second inventory group 'EGF Parts' to open it
      .click('.InventoryGroup:nth-of-type(2) .InventoryGroup-heading');

    // start with a fresh project
    newProject(browser);

    // double check there are no construct viewers present
    browser.assert.countelements('.construct-viewer', 0);

    // create a new construct with a single block
    dragFromTo(browser, '.InventoryItem:nth-of-type(1)', 10, 10, '.cvc-drop-target', 10, 10);

    browser
      // expect two construct views with one block each
      .assert.countelements('.construct-viewer', 1)
      .assert.countelements('.sbol-glyph', 1);


    var blockBounds = openNthBlockContextMenu(browser, '.sceneGraph', 0);
    clickNthContextMenuItem(browser, 3);

    // expect the block to be deleted
    browser.assert.countelements('.sbol-glyph', 0)

    // all done
    browser.end();
  }
};
