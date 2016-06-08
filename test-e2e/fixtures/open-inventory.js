
var openinventory = function(browser) {
  browser
    // make sure inventory is present
    .waitForElementPresent('.SidePanel.Inventory', 5000, 'Expected Inventory Groups');
  // now determine if the inventory is already open
  browser.execute(function() {
    return !!document.querySelector('.SidePanel.Inventory.visible');
  }, [], function(result) {
    console.log('Result:', JSON.stringify(result, null, 2));
    if (!result.value) {
      browser
        .click('.Inventory-trigger')
        .pause(500);
    }
  });
};

module.exports = openinventory;
