const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');
const Post = require('../models/post')

// authentication using passport
passport.use(new LocalStrategy(
    function(username, password, done) {
      // find User
      User.findOne({ username: username }, function (err, user) {
        if (err) {
          console.log("Error in finding User ----> passport") 
          return done(err); 
        }
        if (!user || user.password != password) { 
          console.log("Invalid username/password")
          return done(null, false); 
        }

        return done(null, user);
      });
    }
  ));

  // serializing the user to decide which key is to be kept in cookies (user._id in this case)
  passport.serializeUser(function(user, done) {
    done(null, user._id);
  });
  

  // deserializing the user from the key in cookies
  passport.deserializeUser(function(id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });

  passport.isAuthenticated = (req, res, next)=>{
    // if user is signed-in then call next();
    if(req.isAuthenticated()){
      return next();
    }

    res.redirect('/user/signin')
  }

  passport.setAuthenticatedUser = (req, res, next)=>{
    if(req.isAuthenticated()){
      res.locals.user = req.user;
    }
    next();
  }

  passport.isAuthorized = async (req, res, next)=>{
    next();
  }

  module.exports = passport