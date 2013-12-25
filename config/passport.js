// config/passport.js
// include files that we need
var LocalStrategy = require('passport-local').Strategy;

// load up the user model
var User = require('../app/models/user');

// expose this function to the application 
module.exports = function(passport) { 
/////////////////////////////////// 
  // passport session setup
  
  // serialize user
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  // deserialize user
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  /////////////////////////////////////////////////
  // local signup ===============================
  ////////////////////////////////////////////////

  passport.use('local-signup', new LocalStrategy({
    // overide defaults
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
  },
  
  // check if the user exist?
  function(req, email, password, done) {

    User.findOne({ 'local.email' : email }, function(err, user) {
      if (err) return done(err);    
      if (user) {
        return done(null, false, req.flash('signupMessage', 'This email address is already taken.')); 
      } else {
        // if there is no user with that email
        var newUser = new User();
        newUser.local.email = email; 
        newUser.hashPassword(password); 
        // save user
        newUser.save(function(err) {
          if (err)
            throw err;
          return done(null, newUser); 
        });
      } 
    }); // User.findOne
  })); 

  // =========================================================================
  // LOCAL LOGIN =============================================================
  // =========================================================================
	// we are using named strategies since we have one for login and one for signup
	// by default, if there was no name, it would just be called 'local'

    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) { // callback with email and password from our form

		// find a user whose email is the same as the forms email
		// we are checking to see if the user trying to login already exists
        User.findOne({ 'local.email' :  email }, function(err, user) {
            // if there are any errors, return the error before anything else
            if (err)
                return done(err);

            // if no user is found, return the message
            if (!user)
                return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

			// if the user is found but the password is wrong
            if (!user.validPassword(password))
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

            // all is well, return successful user
            return done(null, user);
        });
    }));
};


