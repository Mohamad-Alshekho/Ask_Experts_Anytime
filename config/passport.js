const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

// Load User model
const Account = require('../models/Account');
const user = new Account();

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      // Match user
        user.findOne(email).then(user => {
          //console.log('inside local strategy');
          //console.log(user[0][0]);
        if (user[0].length == 0) {
          return done(null, false, { message: 'That email is not registered' });
        }

        // Match password
        bcrypt.compare(password, user[0][0].password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: 'Password incorrect' });
          }
        });
      });
    })
  );

  passport.serializeUser(function(user, done) {
    console.log(user[0][0]);
    done(null, user[0][0].accountId);
  });

  passport.deserializeUser(function(id, done) {
    // Handle this error

    user.findById(id).then(user => {
      //console.log(user);
      done(null, user[0][0]);
    });
  });
};