var path = require('path');
var indexFile = path.join(__dirname, "../public/index.html");

function setup(app) {
  app.get('/', function (req, res) {
    res.sendfile(indexFile);
  });
}

exports.setup = setup;
