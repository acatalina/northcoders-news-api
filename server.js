if (!process.env.NODE_ENV) process.env.NODE_ENV = 'dev';

var express = require('express');
var mongoose = require('mongoose');
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

app.use('/api', apiRouter);

app.use('/*', function (req, res) {
  res.status(404).send({reason: 'Not found'});
});

app.listen(PORT, function () {
  console.log(`listening on port ${PORT}`);
});

app.use(function (error, req, res, next) {
  if (error) {
    let statusCode;
    let message;

    switch (error.name) {
      case 'CastError':
        statusCode = 404;
        message = {reason: 'Not found'};
        break;
      case 'ValidationError':
        statusCode = 400;
        message = {reason: error.errors.body.message};
        break;
      default:
        statusCode = 500;
        message = {error: error};
    }

    return res.status(statusCode).send(message);
  }
  
  next();
});
