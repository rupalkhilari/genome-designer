var homepageRegister = require('../fixtures/homepage-register');
var signout = require('../fixtures/signout');
var signin = require('../fixtures/signin');
var dragFromTo = require('../fixtures/dragfromto');
var dragRegion = require('../fixtures/dragregion');
var testProject = require('../fixtures/testproject');
var newConstruct = require('../fixtures/newconstruct');
var clickNthBlock = require('../fixtures/click-nth-block-bounds');
var clickAt = require('../fixtures/clickAt');
var openInventory = require('../fixtures/open-inventory');

module.exports = {
  'Test that you can shift/meta/fence select blocks' : function (browser) {

    browser.windowSize('current', 1200, 900);
    homepageRegister(browser);
    testProject(browser);

    // click first block
    clickNthBlock(browser, '.sceneGraph', 0);

    browser
      .pause(100)
      .waitForElementPresent(".scenegraph-userinterface-selection", 5000, 'expected a selection block')
      .assert.countelements(".scenegraph-userinterface-selection", 1);

    // shift click all 6 blocks and expect to see 10 selection blocks
    browser.execute(function() {
      window.__gde2e = {shiftKey: true}
    }, [], function() {});

    browser.pause(2000);

    for(var i = 0; i < 6; i += 1) {
      clickNthBlock(browser, '.sceneGraph', i);
    }

    // expect all 6 elements to be selected
    browser
      .pause(250)
      .assert.countelements(".scenegraph-userinterface-selection", 6);

    // turn off shift key and test that meta key toggles a blocks selection state
    browser.execute(function() {
      window.__gde2e = {
        shiftKey: false,
        metaKey: true
      }
    }, [], function() {

    });
    browser.pause(2000);

    clickNthBlock(browser, '.sceneGraph', 5);
    browser.pause(1000);
    // expect only 5 elements to be selected
    browser.assert.countelements(".scenegraph-userinterface-selection", 5);

    // click outside the blocks to deselect them all
    clickAt(browser, '.scenegraph-userinterface', 10, 10);
    browser.pause(1000);
    browser.assert.countelements(".scenegraph-userinterface-selection", 0);

    // simulate a fence drag over the entire construct to reselect everything
    browser.execute(function() {
      window.__gde2e = {
        shiftKey: false,
        metaKey: false,
      }
    }, [], function() {});

    dragRegion(browser, '.scenegraph-userinterface', 10, 10, 870, 160, 100);
    browser
      .waitForElementPresent('.scenegraph-userinterface-selection', 5000, 'expected selections')
      // ensure we have all elements selected
      .assert.countelements(".scenegraph-userinterface-selection", 6)
      .end();
  }
};
