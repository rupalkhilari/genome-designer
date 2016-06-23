var fsharp = require('fsharp');

require('crypto').randomBytes(10, function(err, buffer) {
  var token = buffer.toString('hex');
  console.log(token);
});

var script = fsharp('./test2.fsx');
script.pipe(process.stdout);