var signout = function(browser) {
  // NOTE: This only works if currently signed in
  browser
    // click user widget to start sign out
    .click('div.signed-in')
    // click sign out menu item
    .click('.menu-item:nth-of-type(3)')
    .waitForElementPresent('a.signed-out', 5000, 'expected to be signed out')
}

module.exports = signout;
