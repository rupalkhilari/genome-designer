var homepageRegister = require('../fixtures/homepage-register');
var signout = require('../fixtures/signout');
var signin = require('../fixtures/signin');
var dragFromTo = require('../fixtures/dragfromto');
var newProject = require('../fixtures/newproject');
var newConstruct = require('../fixtures/newconstruct');
var testProject = require('../fixtures/testproject');

module.exports = {
  'Test menu shortcuts' : function (browser) {

    browser.windowSize('current', 1200, 900);
    homepageRegister(browser);
    testProject(browser);

    browser
      .keys([browser.Keys.COMMAND, 'a'])
      .assert.countelements(".scenegraph-userinterface-selection", 6)
      // cut all selected blocks
      .keys([browser.Keys.NULL, browser.Keys.COMMAND, 'x'])
      // expect all selections and blocks to be removed
      .assert.countelements(".scenegraph-userinterface-selection", 0)
      .assert.countelements('[data-nodetype="block"]', 0)
      .end();
  }
};
