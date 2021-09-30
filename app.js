const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');

const { NotFoundError } = require('./lib/errors');
const httpStatusCodes = require('./lib/httpStatusCodes');
const { ERROR_MESSAGES } = require('./constants');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use(function (req, res, next) {
  next(new NotFoundError());
});

app.use(function (err, req, res, next) {
  console.error(err);

  const statusCode = err.statusCode || httpStatusCodes.INTERNAL_SERVER;

  res.status(statusCode).json({
    result: 'error',
    message: err.message || ERROR_MESSAGES.INTERNAL_SERVER,
  });
});

module.exports = app;
