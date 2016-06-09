var homepageRegister = require('../fixtures/homepage-register');
var signout = require('../fixtures/signout');
var signin = require('../fixtures/signin');
var dragFromTo = require('../fixtures/dragfromto');
var newProject = require('../fixtures/newproject');
var newConstruct = require('../fixtures/newconstruct');
var clickMainMenu = require('../fixtures/click-main-menu');
var openInventory = require('../fixtures/open-inventory');

module.exports = {
  'Create a construct, save to inventory, drag out to create a new construct' : function (browser) {

    // maximize for graphical tests
    browser.windowSize('current', 1200, 900);

    // register via fixture
    var credentials = homepageRegister(browser);

    // now we can go to the project page
    browser
      // wait for inventory and inspector to be present
      .waitForElementPresent('.SidePanel.Inventory', 5000, 'Expected Inventory Groups')
      .waitForElementPresent('.SidePanel.Inspector', 5000, 'Expected Inspector');

    newProject(browser);
    openInventory(browser);

    browser
      // open sbol blocks
      .click('.InventoryGroup:nth-of-type(3) .InventoryGroup-heading');

    // create a new construct with a single block
    dragFromTo(browser, '.InventoryItemRole:nth-of-type(1)', 10, 10, '.cvc-drop-target', 10, 10);

    // and again
    dragFromTo(browser, '.InventoryItemRole:nth-of-type(1)', 10, 10, '.cvc-drop-target', 10, 10);

    browser
      // expect three construct views, two with one block each
      .assert.countelements('.construct-viewer', 3)
      .assert.countelements('[data-nodetype="block"]', 2)
      // expect SVG elements for each role symbol
      .assert.countelements('.construct-viewer svg', 2);

    // save project
    clickMainMenu(browser, 1, 1);

    // click the my projects inventory tab and expect a project.
    browser
      .click('.InventoryGroup:nth-of-type(2) .InventoryGroup-heading')
      // expect one project
      .waitForElementPresent('.InventoryListGroup-heading', 5000, 'expect a list of projects to appear')
      // click to expand
      .click('.InventoryListGroup-heading')
      .pause(2000)
      // 3 constructs + the test project
      .assert.countelements('.InventoryListGroup', 4)
      // expand them all
      .click('.InventoryListGroup:nth-of-type(1)')
      .click('.InventoryListGroup:nth-of-type(2)')
      .click('.InventoryListGroup:nth-of-type(3)')
      .pause(500)
      // expect to see 2 blocks that we added to the two constructs
      .pause(10000000)
      .assert.countelements('.InventoryItem-item', 2)

    // drag one of the constructs to the new construct drop target
    dragFromTo(browser, '.InventoryListGroup:nth-of-type(1)', 10, 10, '.cvc-drop-target', 10, 10);

    // should have a new construct with a corresponding increase in numbers of blocks/role glyphs
    browser
      // expect three constructs and three blocks
      .assert.countelements('.construct-viewer', 3)
      .assert.countelements('[data-nodetype="block"]', 3)
      // expect SVG elements for each role symbol
      .assert.countelements('.construct-viewer svg', 3);

    // drag a single block to create a new construct
    dragFromTo(browser, '.InventoryItem-item', 10, 10, '.cvc-drop-target', 10, 10);

    // should have a new construct with a corresponding increase in numbers of blocks/role glyphs
    browser
      // expect four construct views and 4 blocks
      .assert.countelements('.construct-viewer', 4)
      .assert.countelements('[data-nodetype="block"]', 4)
      // expect SVG elements for each role symbol
      .assert.countelements('.construct-viewer svg', 4)
      .end();

  }
};
