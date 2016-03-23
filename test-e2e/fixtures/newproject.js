var newproject = function(browser) {
  browser
    // open the file menu and add a couple of new constructs
    .click('.menu-dropdown:nth-of-type(1)')
    .waitForElementPresent('.menu-header-open', 5000, 'expected an open menu')
    // click new construct menu item
    .click('.menu-dropdown:nth-of-type(1) .menu-item:nth-of-type(2)')
    .waitForElementNotPresent('.menu-header-open', 5000, 'expected a closed menu')
};

module.exports = newproject;
