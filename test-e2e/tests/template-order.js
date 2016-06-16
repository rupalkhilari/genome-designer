var homepageRegister = require('../fixtures/homepage-register');
var openInventory = require('../fixtures/open-inventory');
var newProject = require('../fixtures/newproject');
var myProjects = require('../fixtures/myprojects');

module.exports = {
  'Verify we can order all templates' : function (browser) {

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
      .assert.countelements('.order-button', 29);

    for(var i = 1; i <= 3; i += 1) {
      browser
        .pause(1000)
        .click('.construct-viewer:nth-of-type(' + (i + 1) + ') .order-button')
        .waitForElementPresent('.order-form .page1', 10000, 'expected order dialog to appear')
        .pause(1000)
        .submitForm('.order-form')
        .waitForElementPresent('.order-form .page3', 120000, 'expect summary page to appear')
        // click done
        .click('.order-form button:nth-of-type(1)')
        .waitForElementNotPresent('.order-form', 10000, 'expected order dialog to go away')
    }

    browser.end();
  }
};
