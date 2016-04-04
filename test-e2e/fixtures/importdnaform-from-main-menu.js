var importdna = function(browser) {
  browser
    // open the file menu and add a couple of new constructs
    .click('.menu-dropdown:nth-of-type(2)')
    .waitForElementPresent('.menu-header-open', 5000, 'expected an open menu')
    // click import DNA
    .click('.menu-dropdown:nth-of-type(2) .menu-item:nth-of-type(9)')
    .waitForElementNotPresent('.menu-header-open', 5000, 'expected a closed menu')
};

module.exports = importdna;
