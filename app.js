var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.post('/ussd', (req, res) => {
  // Read the variables sent via POST from our API
  const {
      sessionId,
      serviceCode,
      phoneNumber,
      text,
  } = req.body;

  let response = '';

  if (text == '') {
      // This is the first request. Note how we start the response with CON
      response = `CON Habari, Karibu.
      Je, ungependa kupata huduma gani?
      1. Huduma za kilimo
      2. Huduma za ufugaji`;
  } else if ( text == '1') {
      // Business logic for first level response
      response = `CON Huduma ipi ya kilimo unapenda kuipata?
      1. Mazao yafaayo kulimwa mwezi huu
      2. Magonjwa yawezayo tokea mwezi huu`;
  } else if ( text == '2') {
      // Business logic for first level response
      // This is a terminal request. Note how we start the response with END
      response = `CON Your phone number is ${phoneNumber}`;
  } else if ( text == '1*1') {
      // This is a second level response where the user selected 1 in the first instance
      const accountNumber = 'ACC100101';
      // This is a terminal request. Note how we start the response with END
      response = `END Your account number is ${accountNumber}`;
  }

  // Send the response back to the API
  res.set('Content-Type: text/plain');
  res.send(response);
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
