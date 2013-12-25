// app/models/user.js
// load the requirements
var mongoose = require('mongoose'); 
var bcrypt = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({
  local     : { email : String, password : String, name : String },
  facebook  : { id : String, token : String, email : String, name : String },
  twitter   : { id : String, token : String, displayName : String, username : String },
  google    : { id : String, token : String, email : String, name : String }
});

// USER METHODS ======================================================

// check if password is valid
userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password); 
};
  
// method to hash the password
userSchema.methods.hashPassword = function(password) {
  var user = this; 
  bcrypt.hash(password, null, null, function(err, hash) {
    if (err)
      return next(err); 
    user.local.password = hash; // hash the pwd
  });
};

// create user model and include it in the app
module.exports = mongoose.model('User', userSchema); 

 



