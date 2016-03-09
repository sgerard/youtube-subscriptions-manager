var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var session = require('express-session');

var ysm = require('./ysm');

var configDB = require('./config/database');
require('./config/passport')(passport, ysm);

var routes = require('./routes/index');
var users = require('./routes/users');
var ysmRoutes = require('./routes/ysm')(ysm);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
    secret: 'thereisnoplacelikehome',
    saveUninitialized: false,
    resave: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/api/users', users);
app.use('/api/ysm', ysmRoutes);

mongoose.connect(configDB.url);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    if (req.accepts('html')) {
        // Respond with html page.
        fs.readFile(__dirname + '/../../404.html', 'utf-8', function(err, page) {
            res.writeHead(404, {'Content-Type': 'text/html'});
            res.write(page);
            res.end();
        });
      }
      else if (req.accepts('json')) {
        // Respond with json.
        res.status(404).send({ error: 'Not found' });
      }
      else {
        // Default to plain-text. send()
        res.status(404).type('txt').send('Not found');
      }
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
