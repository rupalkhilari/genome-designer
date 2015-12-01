module.exports = {
  'Quick test for the scenegraph' : function (browser) {
    browser
      .url('http://localhost:3000/scenegraph')
      // wait for the scenegraph to appear
      .waitForElementPresent('.sceneGraphContainer > .sceneGraph', 50000, 'Expected a scenegraph')
      .waitForElementPresent('.sceneGraphContainer > .sceneGraph > .node', 50, 'Expected a root node')
      .waitForElementPresent('.sceneGraphContainer .userInterface', 50, 'Expected a user interface')

      .end();
  }
};
