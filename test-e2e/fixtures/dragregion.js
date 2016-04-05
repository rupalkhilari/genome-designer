/**
 * complete sequence of actions to simulate a drag and drop from
 * one element to another.
 */
module.exports = function (browser, srcSelector, srcX, srcY, dstX, dstY, steps) {
  // click on source element
  browser.moveToElement(srcSelector, srcX, srcY)
    .mouseButtonDown(0);

  // generate mouse move events on body from source to destination
  browser.execute(function(srcSelector, srcX, srcY, dstX, dstY, steps) {
    var start = {
      x: srcX,
      y: srcY,
    };
    var end = {
      x: dstX,
      y: dstY,
    };
    var lenx = end.x - start.x;
    var leny = end.y - start.y;

    var pts = [];
    for(var i = 0; i <= 1; i += (1 / (steps || 10))) {
      var xp = start.x + lenx * i;
      var yp = start.y + leny * i;
      pts.push({x:xp, y: yp});
    }
    return pts;
  }, [srcSelector, srcX, srcY, dstX, dstY, steps], function(result) {
    var pts = result.value;
    for(var i = 0; i < pts.length; i +=1 ) {
      console.log(pts[i].x,' ', pts[i].y);
      browser.moveToElement(srcSelector, pts[i].x, pts[i].y);
    }
  });

  browser
    .moveToElement(srcSelector, dstX, dstY)
    .mouseButtonUp(0);
}
