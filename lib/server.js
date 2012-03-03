var path = require('path');

var express = require('express');
var app = express.createServer();
var publicDir = path.join(__dirname, "../public");

app.use(express.static(publicDir));

module.exports = app;
