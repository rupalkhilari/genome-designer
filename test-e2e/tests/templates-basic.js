var homepageRegister = require('../fixtures/homepage-register');
var openInventory = require('../fixtures/open-inventory');
var newProject = require('../fixtures/newproject');
var myProjects = require('../fixtures/myprojects');

module.exports = {
  'Verify all templates are available' : function (browser) {

    // maximize for graphical tests
    browser.windowSize('current', 2000, 1100);
    homepageRegister(browser);
    newProject(browser);
    myProjects(browser);
    browser
      .expect.element('[data-inventory~="project"]:nth-of-type(2)').text.to.equal('EGF Sample Templates');
    browser
      .click('[data-inventory~="project"]:nth-of-type(2)')
      .waitForElementPresent('[data-inventory~="template"]', 5000, 'expected all available templates to appear')
      .assert.countelements('[data-inventory~="template"]', 29)
      .assert.countelements('.construct-viewer', 29)
      .assert.countelements('[data-nodetype="block"]', 277)
      .saveScreenshot('./test-e2e/current-screenshots/templates-basic.png')
      .end();
  }
};
