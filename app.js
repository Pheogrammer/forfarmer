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

  const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const d = new Date();
  let name = month[d.getMonth()];

  let response = '';

  if (text == '') {
    // This is the first request. Note how we start the response with CON
    response = `CON Habari, Karibu.
      Je, ungependa kupata huduma gani?
      1. Huduma za kilimo
      2. Huduma za ufugaji`;
  } else if (text == '1') {
    // Business logic for first level response
    response = `CON Huduma ipi ya kilimo unapenda kuipata?
      1. Mazao yafaayo kulimwa mwezi huu
      2. Magonjwa yawezayo tokea mwezi huu
      3. Kujiunga na huduma ya ujumbe mfupi`;
  }
  else if (text == '1*1') {
    response = `CON Je, upo katika kanda ipi?
      1. Mashariki
      2. Kaskazini
      3. Magharibi
      4. Kusini`;
  }
  else if (text == '1*2') {
    response = `CON Je, upo katika kanda ipi?
      1. Mashariki`;
  } else if (text == '1*1*1') {
    response = `END kutokana na hali ya hewa, Mazao yafaayo kulimwa mwezi huu wa ${name}:
a) Nyanya
b) Mahindi
c) Mihogo
d) Maembe
`;
  } else if (text == '1*2*1') {
    response = `END kutokana na hali ya hewa, Magonjwa yawezayo tokea mwezi huu wa ${name}:
a) Ukungu
b) Viwavi
c) Minyoo

Jiandae kutafuta dawa kutoka kwa wauzaji walio karibu yako
`;
  } else if (text == '1*1*2') {
    response = `END kutokana na hali ya hewa, Mazao yafaayo kulimwa mwezi huu wa ${name}:
    a) Ndizi
    b) Mahindi
    c) Maharage
    d) Karoti
    e) vitunguu
    `;
  }
  else if (text == '1*1*3') {
    response = `END kutokana na hali ya hewa, Mazao yafaayo kulimwa mwezi huu wa ${name}:
    a) Ndizi
    b) Mahindi
    c) Maharage
    d) Karoti
    e) vitunguu
    `;
  } else if (text == '1*1*4') {
    response = `END kutokana na hali ya hewa, Mazao yafaayo kulimwa mwezi huu wa ${name}:
    a) Alizeti
    b) Viazi
    c) Maharage
    d) Mahindi
    e) Mchele
    `;
  } else if (text == '2') {
    response = `CON Huduma ipi ya ufugaji unapenda kuipata?
      1. Magonjwa yawezayo tokea mwezi huu
      2. Kujiunga na huduma ya ujumbe mfupi`;
  } else if (text == '2*1') {
    response = `CON Je, upo katika kanda ipi?
      1. Mashariki`;
  }else if (text == '2*1*1') {
    response = `END Magonjwa yanayoweza kutokea mwezi huu wa ${name}:
      a) Mdondo
      b) Kideri
      c) Minyoo
      d) Mafua
      
      Hakikisha unawasiliana na daktari wa karibu haraka`;
  }

  // Send the response back to the API
  res.set('Content-Type: text/plain');
  res.send(response);
});
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
