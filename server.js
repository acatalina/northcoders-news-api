if (!process.env.NODE_ENV) process.env.NODE_ENV = 'dev';

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const config = require('./.config');
const apiRouter = require('./routes/api');
const errorHandler = require('./error/index');
const cors = require('cors');
const path = require('path');

const db = process.env.DB || config.DB[process.env.NODE_ENV];
const PORT = process.env.PORT || config.PORT[process.env.NODE_ENV] || 3000;

mongoose.connect(db, (error) => {
  if (!error) {
    console.log(`connected to the Database: ${db}`);
  } else {
    console.log(`error connecting to the Database ${error}`);
  }
});

app.use(cors());

app.use('/api', apiRouter);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/public', 'index.html'));
});

app.use('/*', (req, res, next) => {
  return next({name: 'CastError'});
});

app.listen(PORT, function () {
  console.log(`listening on port ${PORT}`);
});

app.use(errorHandler);
