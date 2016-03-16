var homepageRegister = require('../fixtures/homepage-register');
var signout = require('../fixtures/signout');
var signin = require('../fixtures/signin');

module.exports = {
  'Test drag and drop on an empty project.' : function (browser) {

    // maximize for graphical tests
    browser.windowMaximize('current');

    // register via fixture
    var credentials = homepageRegister(browser);

    // now we can go to the project page
    browser
      .url('http://localhost:3000/project/test')
      // wait for inventory and inspector to be present
      .waitForElementPresent('.SidePanel.Inventory', 5000, 'Expected Inventory Groups')
      .waitForElementPresent('.SidePanel.Inspector', 5000, 'Expected Inspector')
      // open inventory
      .click('.Inventory-trigger')
      .waitForElementPresent('.SidePanel.Inventory.visible', 5000, 'Expected inventory to be visible')
      // open inspector
      .click('.Inspector-trigger')
      .waitForElementPresent('.SidePanel.Inspector.visible', 5000, 'Expected inspector to be visible')
      // click the second inventory group to open it
      .click('.InventoryListGroup:nth-of-type(2)')
      // expect at least one inventory item and one block to drop on
      .waitForElementPresent('.InventoryItem-item', 5000, 'expected an inventory item')
      .waitForElementPresent('.sbol-glyph', 5000, 'expected a block to drop on')
      .assert.countelements('.sbol-glyph', 7)
      // click and drag first inventory item
      .moveToElement('.InventoryItem-item:nth-of-type(1)', 10, 10)
      .mouseButtonDown(0);

      // generate mouse move events on body from source to destination
      browser.execute(function() {
        var body = document.body.getBoundingClientRect();
        var src = document.querySelector('.InventoryItem-item:nth-of-type(1)').getBoundingClientRect();
        var dst = document.querySelector('.sbol-glyph:nth-of-type(1)').getBoundingClientRect();
        var start = {
          x: src.left + body.left,
          y: src.top + body.top,
        };
        var end = {
          x: dst.left + body.left + 30,
          y: dst.top + body.top + 10,
        };
        var lenx = end.x - start.x;
        var leny = end.y - start.y;

        var pts = [];
        for(var i = 0; i <= 1; i += 0.1) {
          var xp = start.x + lenx * i;
          var yp = start.y + leny * i;
          pts.push({x:xp, y: yp});
        }
        return pts;
      }, [], function(result) {
        var pts = result.value;
        for(var i = 0; i < pts.length; i +=1 ) {
          browser.moveToElement('body', pts[i].x, pts[i].y);
        }
      });

    browser
      .moveToElement('.sbol-glyph:nth-of-type(1)', 50, 10)
      .mouseButtonUp(0)
      .assert.countelements('.sbol-glyph', 8)
      .pause(5000)
      .end();
  }
};
