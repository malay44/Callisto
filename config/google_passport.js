const passport = require("passport");
const connection = require("./database");

require("dotenv").config();

const User = connection.models.User;
// const gUser = connection.models.gUser;

var GoogleStrategy = require("passport-google-oauth20").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const validPassword = require("../lib/passwordUtils").validPassword;

passport.serializeUser((user, done) => {
  console.log("Serializing user: ", user.id);
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User
    .findById(id)
    .then((user) => {
      console.log("Found user: ", user);
      done(null, user);
    })
    .catch((err) => done(err));
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "https://callistox.herokuapp.com/google/redirect",
    },
    function (accessToken, refreshToken, profileObj, done) {
      // console.log(profileObj)
      User
        .findOne({ sub: profileObj._json.sub })
        .then((user) => {
          console.log(user);
          if (!user) {
            const newUser = new User(profileObj._json);

            newUser.save().then((user) => {
              console.log("new user created");
              console.log(user);
              return done(null, newUser);
            });
          } else {
            return done(null, user);
          }
        })
        .catch((err) => {
          done(err);
        });
    }
  )
);

passport.use(
  new LocalStrategy(
    {
      usernameField: "uname",
      passwordField: "pw",
    },
    function (username, password, done) {
      User.findOne({ username: username })
        .then((user) => {
          if (!user) {
            return done(null, false);
          }

          const isValid = validPassword(password, user.hash, user.salt);

          if (isValid) {
            return done(null, user);
          } else {
            return done(null, false);
          }
        })
        .catch((err) => {
          done(err);
        });
    }
  )
);


