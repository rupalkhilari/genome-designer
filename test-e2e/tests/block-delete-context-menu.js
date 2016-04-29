var homepageRegister = require('../fixtures/homepage-register');
var signout = require('../fixtures/signout');
var signin = require('../fixtures/signin');
var dragFromTo = require('../fixtures/dragfromto');
var newProject = require('../fixtures/newproject');
var newConstruct = require('../fixtures/newconstruct');
var testProject = require('../fixtures/testproject');
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
      // wait for inventory and inspector to be present
      .waitForElementPresent('.SidePanel.Inventory', 5000, 'Expected Inventory Groups')
      .waitForElementPresent('.SidePanel.Inspector', 5000, 'Expected Inspector')
      // open inventory
      .click('.Inventory-trigger')
      .waitForElementPresent('.SidePanel.Inventory.visible', 5000, 'Expected inventory to be visible');

    testProject(browser);

    // delete block from second construct viewer
    var blockBounds = openNthBlockContextMenu(browser, '.construct-viewer:nth-of-type(1) .sceneGraph', 0);
    clickNthContextMenuItem(browser, 3);

    // NOTE: The last item add will be selected. Clicking the first item will group select all blocks

    // expect all blocks to be deleted
    browser
      .pause(250)
      .assert.countelements('.sbol-glyph', 0)
      .end();
  }
};
