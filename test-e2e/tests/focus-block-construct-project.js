var homepageRegister = require('../fixtures/homepage-register');
var signout = require('../fixtures/signout');
var signin = require('../fixtures/signin');
var dragFromTo = require('../fixtures/dragfromto');
var newProject = require('../fixtures/newproject');
var newConstruct = require('../fixtures/newconstruct');
var clickMainMenu = require('../fixtures/click-main-menu');
var clickConstructTitle = require('../fixtures/click-construct-title');

module.exports = {
  'Test that when creating a new project we get a new focused construct' : function (browser) {

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

    // start with a fresh project
    newProject(browser);

    browser
      // open inventory and inspector
      .click('.Inventory-trigger')
      .waitForElementPresent('.SidePanel.Inventory.visible', 5000, 'Expected inventory to be visible')
      // open inspector
      .click('.Inspector-trigger')
      .waitForElementPresent('.SidePanel.Inspector.visible', 5000, 'Expected inspector to be visible')
      // click the second inventory group 'EGF Parts' to open it
      .click('.InventoryGroup:nth-of-type(2) .InventoryGroup-heading')
      // expect at least one inventory item and one block to drop on
      .waitForElementPresent('.InventoryItem', 5000, 'expected an inventory item')
      // expect one focused construct viewer
      .assert.countelements(".construct-viewer", 1);
      // drag one block to first construct
      dragFromTo(browser, '.InventoryItem:nth-of-type(1)', 10, 10, '.construct-viewer:nth-of-type(1) .sceneGraph', 30, 30);

    browser
      // we should have a single focused block, so changing its text should change the displayed block
      .clearValue('.Inspector .InputSimple-input')
      .setValue('.Inspector .InputSimple-input', 'Donald Trump')
      .pause(500)
      // expect the construct title to be updated
      .assert.containsText('[data-nodetype="block"] .nodetext', 'Donald Trump');

    // click the construct title to focus it in inspector
      clickConstructTitle(browser, 'New Construct');
    browser
      .clearValue('.Inspector .InputSimple-input')
      .setValue('.Inspector .InputSimple-input', 'Hillary Clinton')
      .pause(500)
      .assert.containsText('[data-nodetype="construct-title"] .nodetext', 'Hillary Clinton');
    browser
      // focus the project and change its title
      .click('.ProjectHeader')
      .pause(500)
      .clearValue('.Inspector .InputSimple-input')
      .setValue('.Inspector .InputSimple-input', 'Bernie Saunders')
      .pause(500)
      .assert.containsText('.ProjectHeader-title', 'Bernie Saunders')
      .end();
  }
};
