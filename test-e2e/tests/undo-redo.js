var homepageRegister = require('../fixtures/homepage-register');
var signout = require('../fixtures/signout');
var signin = require('../fixtures/signin');
var dragFromTo = require('../fixtures/dragfromto');
var newProject = require('../fixtures/newproject');
var newConstruct = require('../fixtures/newconstruct');
var testProject = require('../fixtures/testproject');

module.exports = {
  'Test undo / redo after copying a construct' : function (browser) {

    // maximize for graphical tests
    browser.windowSize('current', 1200, 900);

    // register via fixture
    var credentials = homepageRegister(browser);

    // now we can go to the project page
    browser
      .url('http://localhost:3001/')
      // wait for inventory and inspector to be present
      .waitForElementPresent('.SidePanel.Inventory', 5000, 'Expected Inventory Groups')
      .waitForElementPresent('.SidePanel.Inspector', 5000, 'Expected Inspector');

    testProject(browser);

      // expect to start with 6 blocks
    browser
      .assert.countelements('[data-nodetype="block"]', 6)
      // send select all
      .keys([browser.Keys.COMMAND, 'a'])
      .pause(1000)
      // send copy
      .keys([browser.Keys.NULL, browser.Keys.COMMAND, 'c'])
      .pause(1000)
      // send new construct
      .keys([browser.Keys.NULL, browser.Keys.SHIFT, browser.Keys.CONTROL, 'n'])
      .pause(1000)
      // paste
      .keys([browser.Keys.NULL, browser.Keys.COMMAND, 'v'])
      .pause(1000)
      // should now have 12 blocks
      .assert.countelements('[data-nodetype="block"]', 12)
      // undo
      .keys([browser.Keys.NULL, browser.Keys.COMMAND, 'z'])
      .pause(1000)
      // back to 6 blocks
      .assert.countelements('[data-nodetype="block"]', 6)
      // redo
      .keys([browser.Keys.NULL, browser.Keys.SHIFT, browser.Keys.COMMAND, 'z'])
      .pause(1000)
      // back to 12 blocks
      .assert.countelements('[data-nodetype="block"]', 12)

      .end();
  }
};
