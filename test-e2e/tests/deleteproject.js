var homepageRegister = require('../fixtures/homepage-register');
var signout = require('../fixtures/signout');
var signin = require('../fixtures/signin');
var dragFromTo = require('../fixtures/dragfromto');
var testProject = require('../fixtures/testproject');
var newConstruct = require('../fixtures/newconstruct');
var clickMainMenu = require('../fixtures/click-main-menu');

module.exports = {
  'Test that we can delete a construct via its context menu' : function (browser) {

    // maximize for graphical tests
    browser.windowSize('current', 1200, 900);
    homepageRegister(browser);
    testProject(browser);

    browser
      .pause(3000)
      // start with six blocks in the project to be deleted
      .assert.countelements('[data-nodetype="block"]', 6);

    // click delete project in the menu
    clickMainMenu(browser, 1, 5);

    // wait for form to appear
    browser
      .waitForElementPresent('form.ok-cancel-form', 5000, 'expected confirmation dialog to appear')
      // delete is the default action
      .submitForm('form.ok-cancel-form')
      // wait for form to go away
      .waitForElementNotPresent('form.ok-cancel-form', 5000, 'expected confirmation dialog to appear')
      // this will open the templates project with 29 constructs
      .pause(5000)
      .assert.countelements('.construct-viewer', 29)
      .end();
  }
};
