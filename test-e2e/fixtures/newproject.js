var clickMainMenu = require('./click-main-menu');

var newproject = function(browser) {
  browser.pause(2000)
  clickMainMenu(browser, 1, 4);
  browser
    .pause(3000)
    .waitForElementPresent('.construct-viewer', 5000, 'expect a construct for the new project')
    .assert.countelements('.construct-viewer', 1);
};

module.exports = newproject;
