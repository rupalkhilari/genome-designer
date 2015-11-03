module.exports = {
  'Page Fabric Test' : function (browser) {
    browser
      .url('http://localhost:3000/')
      // wait for the global nav to indicate the page as loaded
      .waitForElementPresent('.GlobalNav-title', 50000, 'Expected a global nav')
      .assert.countelements('.ProjectSelect', 1, 'expected 1 project selector in the global nav')
      .end();
  }
};
