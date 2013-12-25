// app/routes.js

module.exports = function(app, passport) {
  
  // HOME PAGE ==================================
  app.get('/', function(req, res) {
    res.render('index.ejs'); // load the index.ejs file
  });

  // LOGIN PAGE
  app.get('/login', function(req, res) {
    res.render('login.ejs', { 
      message: req.flash('signupMessage') 
    });
  });

    // LOGOUT PAGE
  app.get('/logout', function(req, res) {
    res.render('index.ejs', { 
      message: req.flash('signoutMessage') 
    });
  });


  // SIGNUP PAGE ================================
  app.get('/signup', function(req, res) {
    // render the page and pass in flash data
    res.render('signup.ejs', { 
      message: req.flash('signupMessage') });
  });

  // PROFILE SECTION ============================
  app.get('/profile', isLoggedIn, function(req, res) {
    res.render('profile.ejs', {
      user : req.user // get the user out of the session and pass to template
    });
  });

  // process SIGNUP PAGE
  app.post('/signup', passport.authenticate('local-signup', {
    sucessRedirect : '/profile', // redirect to secure profile page
    failureRedirect : '/signup', 
    failureFlash: true
  }));

  // process the login form
	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/login', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

}; // END ROUTES

// route middlewara to make sure user is logged in

function isLoggedIn(req, res, next) {
  // if user is authenticated, keep calm and carry on
  if (req.isAuthenticated())
    return next(); 
  // if NOT send them back to homepage
  res.redirect('/'); 
  // add flash message?
}





