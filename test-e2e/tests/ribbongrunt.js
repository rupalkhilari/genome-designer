
var homepageRegister = require('../fixtures/homepage-register');
var signout = require('../fixtures/signout');
var signin = require('../fixtures/signin');

module.exports = {
  'Test that the ribbon grunt appears.' : function (browser) {
    // register via fixture and get credentials used
    var credentials = homepageRegister(browser);
    // now sign out
    signout(browser);
    browser
      .waitForElementPresent('.ribbongrunt', 5000, 'Expected a grunt')
      .end();
  }
};
