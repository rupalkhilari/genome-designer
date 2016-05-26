var homepageRegister = require('../fixtures/homepage-register');
var signout = require('../fixtures/signout');
var signin = require('../fixtures/signin');
var dragFromTo = require('../fixtures/dragfromto');
var newProject = require('../fixtures/newproject');
var newConstruct = require('../fixtures/newconstruct');
var clickMainMenu = require('../fixtures/click-main-menu');
var testProject = require('../fixtures/testproject');

module.exports = {
  'Test copy and paste via keyboard for nested test project' : function (browser) {

    // maximize for graphical tests
    browser.windowSize('current', 1200, 900);

    // register via fixture
    var credentials = homepageRegister(browser);

    // start with simple test project
    testProject(browser);

    // now we can go to the project page
    browser
      // expect to start with 8 blocks
      .assert.countelements('.role-glyph', 6)
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
      // should now have 16 blocks
      .assert.countelements(".role-glyph", 12)
      .end();
  }
};
