// tools setup
var express = require('express');
var app = express(); 
var port = process.env.PORT || 5000;
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');

// configuration
var configDB = require('./config/database.js');
mongoose.connect(configDB.url); // connect to database

app.configure (function() {

  // express application setup
  app.use(express.logger('dev'));   // log every request to console
  app.use(express.cookieParser());  // read cookies
  app.use(express.bodyParser());    // get information from html forms
  app.set('view engine', 'ejs');    // setup ejs for templating

  // passport setup 
  app.use(express.session({ secret: "petarivacicjecar" })); //session secret
  app.use(passport.initialize());
  app.user(passport.session()); // persistent login session
  app.user(flash()); // use connect flash for flash messages stored in session

  //
  //
  //
  //
});

// routes =======================================
require('./app/routes.js')(app, passport); // load our routes from routes.js file

// launch =======================================
app.listen(port);
console.log('Ova aplikacija je napravljena u Srbiji na portu ' +port);

