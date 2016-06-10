var homepageRegister = require('../fixtures/homepage-register');
var signout = require('../fixtures/signout');
var signin = require('../fixtures/signin');
var dragFromTo = require('../fixtures/dragfromto');
var dragRegion = require('../fixtures/dragregion');
var newProject = require('../fixtures/newproject');
var newConstruct = require('../fixtures/newconstruct');
var clickNthBlock = require('../fixtures/click-nth-block-bounds');
var clickAt = require('../fixtures/clickAt');
var openInventory = require('../fixtures/open-inventory');

module.exports = {
  'Test that you can shift/meta/fence select blocks' : function (browser) {

    // maximize for graphical tests
    browser.windowSize('current', 1200, 900);

    // register via fixture
    var credentials = homepageRegister(browser);

    // now we can go to the project page
    browser
      // wait for inventory and inspector to be present
      .waitForElementPresent('.SidePanel.Inventory', 5000, 'Expected Inventory Groups')
      .waitForElementPresent('.SidePanel.Inspector', 5000, 'Expected Inspector');

    // start with a fresh project, single construct
    newProject(browser);

      // open inventory
    openInventory(browser);
    browser
      // sketch blocks
      .click('.InventoryGroup:nth-of-type(3) .InventoryGroup-heading');

    // expect one construct
    browser.assert.countelements('.construct-viewer', 1);

    // add a single block
    dragFromTo(browser, '.InventoryItemRole:nth-of-type(1)', 10, 10, '.construct-viewer:nth-of-type(1)', 100, 70);

    browser
      // expect one block
      .assert.countelements('[data-nodetype="block"]', 1)
      .pause(500);

    // drag some other blocks into the construct
    // drag an item from the inventory

    for(var i = 1; i < 10; i += 1) {
      dragFromTo(
          browser,
          '.InventoryItemRole:nth-of-type(' + i + ')', 10, 10,
          '.construct-viewer:nth-of-type(1) .sceneGraph [data-nodetype="block"]', 10, 10);
      browser.pause(50);
    }

    // should have 10 blocks total
    browser.assert.countelements('[data-nodetype="block"]', 10);
    var blockBounds = clickNthBlock(browser, '.sceneGraph', 0);

    // expect 1 selection block
    browser
      .waitForElementPresent(".scenegraph-userinterface-selection", 5000, 'expected a selection block')
      .assert.countelements(".scenegraph-userinterface-selection", 1);

    // shift click all 10 blocks and expect to see 10 selection blocks
    browser.execute(function() {
      window.__gde2e = {shiftKey: true}
    }, [], function() {});

    for(var i = 0; i < 10; i += 1) {
      var blockBounds = clickNthBlock(browser, '.sceneGraph', i);
    }

    // expect all 10 elements to be selected
    browser
      .pause(250)
      .assert.countelements(".scenegraph-userinterface-selection", 10);

    // turn off shift key and test that meta key toggles a blocks selection state
    browser.execute(function() {
      window.__gde2e = {
        shiftKey: false,
        metaKey: true
      }
    }, [], function() {});

    clickNthBlock(browser, '.sceneGraph', 5);
    browser.pause(1000);
    // expect only 9 elements to be selected
    browser.assert.countelements(".scenegraph-userinterface-selection", 9);

    // click outside the blocks to deselect them all
    clickAt(browser, '.scenegraph-userinterface', 10, 10);
    browser.pause(1000);
    browser.assert.countelements(".scenegraph-userinterface-selection", 0);

    // simulate a fence drag over the entire construct to reselect everything
    browser.execute(function() {
      window.__gde2e = {
        shiftKey: false,
        metaKey: false,
      }
    }, [], function() {});

    dragRegion(browser, '.scenegraph-userinterface', 10, 10, 870, 160, 100);
    browser
      .waitForElementPresent('.scenegraph-userinterface-selection', 5000, 'expected selections')
      // ensure we have all elements selected
      .assert.countelements(".scenegraph-userinterface-selection", 10)
      .end();
  }
};
