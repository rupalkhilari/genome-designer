var homepageRegister = require('../fixtures/homepage-register');
var newConstruct = require('../fixtures/newconstruct');
var clickAt = require('../fixtures/clickAt');
var rightClickAt = require('../fixtures/rightClickAt');
var clickContextMenu = require('../fixtures/click-popmenu-nth-item.js');

module.exports = {
  'Test deleting a construct using construct menu in header' : function (browser) {
    var credentials = homepageRegister(browser);
    browser
      // wait for inventory and inspector to be present to ensure app is ready
      .waitForElementPresent('.SidePanel.Inventory', 5000, 'Expected Inventory Groups')
      .waitForElementPresent('.SidePanel.Inspector', 5000, 'Expected Inspector');

    newConstruct(browser);

    browser
      .waitForElementPresent('.construct-viewer', 5000, 'expected one construct viewer')
      .waitForElementPresent('[data-nodetype="construct-title"]', 5000, 'expected a title for the construct')

    rightClickAt(browser, '[data-nodetype="construct-title"]', 15, 15);

    clickContextMenu(browser, 2);

    browser
      .waitForElementNotPresent('.construct-viewer', 5000, 'expected construct viewer to go away')
      .end();
  }
};
