const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const twilio = require('twilio');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
require('dotenv').config();

const app = express();

// set up view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// add middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// set up routes
app.use('/', indexRouter);
app.use('/users', usersRouter);

// handle USSD requests
app.post('/ussd', (req, res) => {
  // extract variables from request body
  const {
    sessionId,
    serviceCode,
    phoneNumber,
    text,
  } = req.body;

  // get the name of the current month
  const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const currentMonth = month[new Date().getMonth()];

  // initialize response variable
  let response = '';

  if (text === '') {
    // this is the first request
    response = `CON Habari, Karibu.
      Je, ungependa kupata huduma gani?
      1. Huduma za kilimo
      2. Huduma za ufugaji`;
  } else if (text === '1') {
    // handle first level response for farming services
    response = `CON Huduma ipi ya kilimo unapenda kuipata?
      1. Mazao yafaayo kulimwa mwezi huu
      2. Magonjwa yawezayo tokea mwezi huu
      3. Kujiunga na huduma ya ujumbe mfupi`;
  } else if (text === '1*1') {
    // handle second level response for farming services
    response = `CON Je, upo katika kanda ipi?
      1. Mashariki
      2. Kaskazini
      3. Magharibi
      4. Kusini`;
  } else if (text === '1*2') {
    // handle second level response for farming services
    response = `CON Je, upo katika kanda ipi?
      1. Mashariki`;
  } else if (text === '1*1*1') {
    // handle third level response for farming services
    response = `END kutokana na hali ya hewa, Mazao yafaayo kulimwa mwezi huu wa ${currentMonth}:
      a) Nyanya
      b) Mahindi
      c) Mihogo
      d) Maembe`;
  } else if (text === '1*2*1') {
    // handle third level response for farming services
    response = `END kutokana na hali ya hewa, Magonjwa yawezayo tokea mwezi huu wa ${currentMonth}:
      a) Ukungu
      b) Viwavi
      c) Minyoo

      Jiandae kutafuta dawa kutoka kwa wauzaji walio karibu yako`;
  } else if (text == '1*1*2') {
    response = `END kutokana na hali ya hewa, Mazao yafaayo kulimwa mwezi huu wa ${currentMonth}:
    a) Ndizi
    b) Mahindi
    c) Maharage
    d) Karoti
    e) vitunguu
    `;
  }
  else if (text == '1*1*3') {
    response = `END kutokana na hali ya hewa, Mazao yafaayo kulimwa mwezi huu wa ${currentMonth}:
    a) Ndizi
    b) Mahindi
    c) Maharage
    d) Karoti
    e) vitunguu
    `;
  } else if (text == '1*1*4') {
    response = `END kutokana na hali ya hewa, Mazao yafaayo kulimwa mwezi huu wa ${currentMonth}:
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

  } else if (text == '1*3' | text == '2*2') {
    // Set your app credentials
    const credentials = {
      apiKey: process.env.App_APIKEY,
      username: process.env.USERNAME || 'ForFarmer',
    };

    // Initialize the SDK
    const AfricasTalking = require('africastalking')(credentials);

    // Get the SMS service
    const sms = AfricasTalking.SMS;


    const options = {
      // Set the numbers you want to send to in international format
      to: [phoneNumber],
      // Set your message
      message: "Asante kwa kujiunga na huduma hii, utapata taarifa za kilimo na ufugaji kila wiki. Utakatwa shilingi 1 kwa kila ujumbe ",
      // Set your shortCode or senderId
      from: 'ForFarmer'
    }

    // That’s it, hit send and we’ll take care of the rest
    sms.send(options)
      .then(console.log)
      .catch(console.log);

  } else if (text == '2*1*1') {
    response = `END Magonjwa yanayoweza kutokea mwezi huu wa ${currentMonth}:
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
