
module.exports = {
  'Test homepage registration and sign in.' : function (browser) {
    browser
      .url('http://localhost:3000/homepage')
      // wait for homepage to be present before starting
      .waitForElementPresent('.homepage', 5000, 'Expected homepage element to be present')
      // open sign in dialog
      .click('.homepage-getstarted')
      // wait for it to be present
      .waitForElementPresent('#auth-signin', 5000, 'Expected form to become visible')
      // ensure it is the sign in dialog
      .getText('#auth-signin .title', function(result) {
        browser.assert.equal(result.value, "Sign In")
      })
      // click the a tag that switches to registration
      .click('#auth-signin a:nth-of-type(1)')
      // wait for registration dialog to appear
      .waitForElementPresent('#auth-signup', 5000, 'Expected form to become visible')
      // submit with no values to ensure errors appear
      .submitForm('#auth-signup')
      // expect 6 errors to appear ( name error, two email errors, two password erros TOS error )
      .assert.countelements('.error.visible', 6);
      // create fields with viable values including a random email
    var email = new Date().getTime() + '@hotmail.com';
    browser
      .setValue('#auth-signup input:nth-of-type(1)', 'George')
      .setValue('#auth-signup input:nth-of-type(2)', 'Washington')
      .setValue('#auth-signup input:nth-of-type(3)', email)
      .setValue('#auth-signup input:nth-of-type(4)', email)
      .setValue('#auth-signup input:nth-of-type(5)', '123456')
      .setValue('#auth-signup input:nth-of-type(6)', '123456')
      .click('.checkbox input')
      .submitForm('#auth-signup')
      .waitForElementPresent('div.signed-in', 5000, 'expected to be signed in')
      // click user widget to start sign out
      .click('div.signed-in')
      // click sign out menu item
      .click('.menu-item:nth-of-type(3)')
      .waitForElementPresent('a.signed-out', 5000, 'expected to be signed out')
      // sign back in with previous credentials
      .click('a.signed-out')
      .waitForElementPresent('#auth-signin', 5000, 'Expected sign in dialog to become visible')
      // try submitting with no credentials
      .submitForm('#auth-signin')
      // expect 1 error, missing credentials
      .assert.countelements('.error.visible', 1)
      // try with bad credentials
      .setValue('#auth-signin input:nth-of-type(1)', 'billgates@microsoft.com')
      .setValue('#auth-signin input:nth-of-type(2)', '123456')
      .submitForm('#auth-signin')
      // expect 1 error, bad credentials
      .assert.countelements('.error.visible', 1)
      // try correct credentials
      .clearValue('#auth-signin input:nth-of-type(1)')
      .setValue('#auth-signin input:nth-of-type(1)', email)
      .submitForm('#auth-signin')
      .waitForElementPresent('div.signed-in', 5000, 'expected to be signed in')
      .end();
  }
};
