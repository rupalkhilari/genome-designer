var homepageRegister = require('../fixtures/homepage-register');
var openInventory = require('../fixtures/open-inventory');
var myProjects = require('../fixtures/myprojects');

module.exports = {
  'Verify all templates are available' : function (browser) {

    // maximize for graphical tests
    browser.windowSize('current', 1200, 900);
    homepageRegister(browser);
    myProjects(browser);
    browser
      .expect.element('[data-inventory~="project"]:nth-of-type(1)').text.to.equal('EGF Sample Templates');
    browser
      .click('[data-inventory~="project"]:nth-of-type(1)')
      .waitForElementPresent('[data-inventory~="template"]', 5000, 'expected all available templates to appear')
      .assert.countelements('[data-inventory~="template"]', 29)
      .end();
  }
};
