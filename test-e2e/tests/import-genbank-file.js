var homepageRegister = require('../fixtures/homepage-register');
var signout = require('../fixtures/signout');
var signin = require('../fixtures/signin');
var dragFromTo = require('../fixtures/dragfromto');
var newProject = require('../fixtures/newproject');
var newConstruct = require('../fixtures/newconstruct');
var clickMainMenu = require('../fixtures/click-main-menu');

module.exports = {
  'Import a DNA sequence into a sketch block' : function (browser) {

    // register via fixture
    var credentials = homepageRegister(browser);

    // now we can go to the project page
    browser
      .url('http://localhost:3000/project/test')
      // wait for inventory and inspector to be present
      .waitForElementPresent('.SidePanel.Inventory', 5000, 'Expected Inventory Groups')
      .waitForElementPresent('.SidePanel.Inspector', 5000, 'Expected Inspector');

    // start with a new project to ensure no construct viewers are visible
    newProject(browser);

    // double check there are no construct viewers present
    browser.assert.countelements('.construct-viewer', 0);

    // click the file menu -> Upload Genbank File
    clickMainMenu(browser, 1, 5);

    // set hacky global to indicate we are testing the form
    browser.execute(function() {
      window.__testGenbankImport = true;
    });

    browser
      .waitForElementPresent('.genbank-import-form', 5000, 'Expect the import dialog to appear')
      // click submit button to start the upload of fake data
      .submitForm('.genbank-import-form')
      // wait for a construct viewer to become visible
      .waitForElementPresent('.construct-viewer', 5000, 'expected a construct viewer to appear')
      .end();
  }
};
