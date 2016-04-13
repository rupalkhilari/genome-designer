var homepageRegister = require('../fixtures/homepage-register');
var signout = require('../fixtures/signout');
var signin = require('../fixtures/signin');
var dragFromTo = require('../fixtures/dragfromto');
var newProject = require('../fixtures/newproject');
var newConstruct = require('../fixtures/newconstruct');
var clickMainMenu = require('../fixtures/click-main-menu');

module.exports = {
  'Test that when creating a new project we get a new focused construct' : function (browser) {

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

    // start with a fresh project
    newProject(browser);

    browser
      .pause(1000)
      // expect one focused construct viewer
      .assert.countelements(".construct-viewer", 1)
      // the dark style is only present for unfocused constructs so don't expect it
      .waitForElementNotPresent('.sceneGraph-dark', 5000, 'expected construct to be focused')
      .end();
  }
};
