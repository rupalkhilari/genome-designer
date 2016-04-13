var homepageRegister = require('../fixtures/homepage-register');
var signout = require('../fixtures/signout');
var signin = require('../fixtures/signin');
var dragFromTo = require('../fixtures/dragfromto');
var newProject = require('../fixtures/newproject');
var newConstruct = require('../fixtures/newconstruct');
var openNthBlockContextMenu = require('../fixtures/open-nth-block-contextmenu');
var clickNthContextMenuItem = require('../fixtures/click-popmenu-nth-item');
var importDNAFromMainMenu = require('../fixtures/importdnaform-from-main-menu');

module.exports = {
  'Import a DNA sequence into a sketch block' : function (browser) {

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
      // open the sketch blocks
      .click('.InventoryGroup:nth-of-type(4) .InventoryGroup-heading');

    // start with a fresh project
    newProject(browser);

    // double check there are no construct viewers present
    browser.assert.countelements('.construct-viewer', 0);

    // create a new construct with a single sketch block
    dragFromTo(browser, '.InventoryItem:nth-of-type(1)', 10, 10, '.cvc-drop-target', 10, 10);

    browser
      // expect one construct view and one block
      .assert.countelements('.construct-viewer', 1)
      .assert.countelements('.sbol-glyph', 1);


    var blockBounds = openNthBlockContextMenu(browser, '.sceneGraph', 0);
    clickNthContextMenuItem(browser, 2);

    // wait for the import DNA modal window
    browser
      .waitForElementPresent('.importdnaform', 5000, 'expected the import form')
      // it should contain a text area if there was a selected block
      .waitForElementPresent('.importdnaform textarea', 5000, 'expected a text area')
      // enter a BAD sequence
      .setValue('.importdnaform textarea', 'XXXX')
      // expect to get an error message
      .waitForElementPresent('.importdnaform .error.visible', 5000, 'expected an error message')
      // set a valid sequence with white space and newlines
      .clearValue('.importdnaform textarea')
      .setValue('.importdnaform textarea', 'atgc atgc\n atgc')
      // expect a message about a valid 12 character sequence
      .assert.containsText('.importdnaform label:nth-of-type(1)', 'Sequence Length: 12')
      // submit the form with the valid sequence
      .submitForm('.importdnaform')
      // wait for the grunt ribbon to confirm,
      .waitForElementPresent('.ribbongrunt', 5000, 'expected a grunt')
      .assert.containsText('.ribbongrunt', 'Sequence was successfully inserted.');

    // now start a new project and ensure the dialog is no operational with no block selected
    // start with a fresh project
    newProject(browser);

    // double check there are no construct viewers present
    browser.waitForElementNotPresent('.construct-viewer', 5000, 'expect no construct viewers')

    // open import DNA from main edit menu
    importDNAFromMainMenu(browser);

    browser
      .waitForElementPresent('.importdnaform', 5000, 'expected a form')
      .assert.containsText('.importdnaform label:nth-of-type(1)', 'Please select at least one block first')
      .end();
  }
};
