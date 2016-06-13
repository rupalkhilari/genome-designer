var clickMainMenu = require('./click-main-menu');

var newproject = function(browser) {
  clickMainMenu(browser, 1, 4);
  browser
    .pause(250)
    .waitForElementPresent('.construct-viewer', 5000, 'expect a construct for the new project')
};

module.exports = newproject;
