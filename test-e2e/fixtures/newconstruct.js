var newconstruct = function(browser) {
  browser
    // open the file menu and add a couple of new constructs
    .click('.menu-dropdown:nth-of-type(1)')
    .waitForElementPresent('.menu-header-open', 5000, 'expected an open menu')
    .click('.menu-dropdown:nth-of-type(1) .menu-item:nth-of-type(4)')
    .waitForElementNotPresent('.menu-header-open', 5000, 'expected a closed menu')
    .waitForElementPresent('.construct-viewer', 5000, 'expected at least one construct viewer')
};

module.exports = newconstruct;
