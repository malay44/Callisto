const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const connection = require('./database');
const User = connection.models.User;
const validPassword = require('../lib/passwordUtils').validPassword;

const customFields = {
    usernameField: 'uname',
    passwordField: 'pw'
};

const verifyCallback = (username, password, done) => {
    console.log("into verify callback");
    User.findOne({ username: username })
        .then((user) => {

            if (!user) { return done(null, false) }
            
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

// const strategy  = ;

passport.use(
    new LocalStrategy({
    usernameField: 'uname',
    passwordField: 'pw'
}, function (username, password, done){
    User.findOne({ username: username })
        .then((user) => {

            if (!user) { return done(null, false) }
            
            const isValid = validPassword(password, user.hash, user.salt);
            
            if (isValid) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        })
        .catch((err) => {   
            done(err);
        })
}
));

passport.serializeUser((user, done) => {
    console.log("Serializing user: ", user.id);
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id, done) => {
    await User
      .findById(id)
      .then((user) => {
        console.log("Found user: ", user);
        done(null, user);
      })
      .catch((err) => done(err));
  });


// passport.serializeUser((user, done) => {
//     done(null, user.id);
// });

// passport.deserializeUser((userId, done) => {
//     User.findById(userId)
//         .then((user) => {
//             done(null, user);
//         })
//         .catch(err => done(err))
// });

