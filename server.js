if (!process.env.NODE_ENV) process.env.NODE_ENV = 'dev';

var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var app = express();
var config = require('./config');
var db = config.DB[process.env.NODE_ENV] || process.env.DB;
var PORT = config.PORT[process.env.NODE_ENV] || process.env.PORT;
const apiRouter = require('./routes/api');

mongoose.connect(db, function (err) {
  if (!err) {
    console.log(`connected to the Database: ${db}`);
  } else {
    console.log(`error connecting to the Database ${err}`);
  }
});

app.use(bodyParser.json());

app.use(function(req, res, next) {
  console.log('Got a request!');
  next();
});

app.use('/api', apiRouter);

app.listen(PORT, function () {
  console.log(`listening on port ${PORT}`);
});

app.use('/*', function(error, req, res, next) {
  if (error) {
    res.status(500).send({error: error});
  }
});
