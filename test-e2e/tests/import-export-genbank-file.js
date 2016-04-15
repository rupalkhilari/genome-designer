var homepageRegister = require('../fixtures/homepage-register');
var signout = require('../fixtures/signout');
var signin = require('../fixtures/signin');
var dragFromTo = require('../fixtures/dragfromto');
var newProject = require('../fixtures/newproject');
var newConstruct = require('../fixtures/newconstruct');
var clickMainMenu = require('../fixtures/click-main-menu');
var http = require("http");

module.exports = {
  'Import a genbank file as a project then export project as a genbank file' : function (browser) {

    // register via fixture
    var credentials = homepageRegister(browser);

    // now we can go to the project page
    browser
      .url('http://localhost:3001/project/test')
      // wait for inventory and inspector to be present
      .waitForElementPresent('.SidePanel.Inventory', 5000, 'Expected Inventory Groups')
      .waitForElementPresent('.SidePanel.Inspector', 5000, 'Expected Inspector');

    // start with a new project to ensure no construct viewers are visible
    newProject(browser);

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
      .pause(5000);

    // we can't actually download the file but we can ensure the correct header is present at the expected url
    browser.url(function (response) {
      // save original project url
      var projectURL = response.value;
      var projectId = response.value.split('/').pop();
      var uri = 'http://localhost:3001/export/genbank/' + projectId;
      browser
        .url(uri)
        .pause(5000)
        .assert.urlContains(projectURL)
        .end();

    });
  }
};
