var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');

var compression = require('compression');
var helmet = require('helmet');

//var routes = require('./routes/index');
var index = require('./routes/index');
var users = require('./routes/users');
var catalog = require('./routes/catalog');

//create the Express application object
var app = express();

//*********************************************************************
//@id started adding custom code here

//Set up mongoose connection
var mongoose = require('mongoose');
//var mongoDB = 'mongodb://localhost/test';
var mongoDB = process.env.MONGODB_URI || 'mongodb://idowu:plato1982@ds151963.mlab.com:51963/my-library';
mongoose.connect(mongoDB);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//***********************************************

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(compression()); //Compress all routes
app.use(helmet()); //secure app with appropiate HTTP headers
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressValidator()); // Add this after the bodyParser middlewares!

//app.use('/', routes);
app.use('/', index);
app.use('/users', users);
app.use('/catalog', catalog);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
