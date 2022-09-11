const router = require("express").Router();
const passport = require("passport");
const genPassword = require("../lib/passwordUtils").genPassword;
const connection = require("../config/database");
const User = connection.models.User;
const Event = connection.models.Event;
const isAuth = require("./authMiddleware").isAuth;
const isAdmin = require("./authMiddleware").isAdmin;
const isUser = require("./authMiddleware").isUser;
const path = require("path");

/**
 * -------------- POST ROUTES ----------------
 */

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login-failure",
    successRedirect: "home",
  })
);

router.post("/register", (req, res, next) => {
  User.findOne({ username: req.body.uname })
    .then((user) => {
      if (user) {
        res.send(
          `<script>alert("user alreay exists"); window.location.href = "/login"; </script>`
        );
      } else {
        const saltHash = genPassword(req.body.pw);
        const salt = saltHash.salt;
        const hash = saltHash.hash;
        const newUser = new User({
          username: req.body.uname,
          hash: hash,
          salt: salt,
          admin: false,
        });

        newUser.save().then((user) => {
          console.log(user);
        });

        res.redirect("/");
        next();
      }
    })
    .catch((err) => done(err));
});

router.post("/admin/addevent", isAdmin, (req, res, next) => {
  // console.log("hi");
  // res.send('You made it to the admin route.');
  Event.findOne({ name: req.body.ename })
    .then((event) => {
      if (event) {
        res.send(
          `<script>alert("Event alreay exists"); window.location.href = "/admin/addevent"; </script>`
        );
      } else {
        const newEvent = new Event({
          name: req.body.ename,
          artist: {
            name: req.body.aname,
            photo: req.body.aiURL,
          },
          discription: req.body.disc,
          briefdiscription: req.body.bdisc,
          type: req.body.eType,
          date: req.body.eDate,
          place: req.body.ePlace,
          time: req.body.eTime,
          photo: req.body.eiURL,
          registrationFee: req.body.eFees,
          regUsers: '6314d87f7876e6b5172718a5',
          // hidden: req.body.hidden,
        });
        newEvent.save().then((event) => {
          console.log(event);
        });
        res.redirect("/admin/addevent");
      }
    })
    .catch((err) => console.log(err));
});


router.post("/admin/editevent", isAdmin, (req, res, next) => {
  const eventid = req.rawHeaders[33].substring(28);
  res.redirect(`http://localhost:3000/admin/editevent/${eventid}`)
});

router.post("/admin/editevent/:id", isAdmin, (req, res, next) => {
  Event.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.ename,
      artist: {
        name: req.body.aname,
        photo: req.body.aiURL,
      },
      discription: req.body.disc,
      briefdiscription: req.body.bdisc,
      type: req.body.eType,
      date: req.body.eDate,
      place: req.body.ePlace,
      time: req.body.eTime,
      photo: req.body.eiURL,
      registrationFee: req.body.eFees,
      // hidden: req.body.hidden,
    },
    function (err, event) {
      if (err) {
        console.log(err);
      } else {
        res.redirect(`http://localhost:3000/event/${req.params.id}`);
        console.log(event);
      }
    }
  );
});

router.post("/admin/eventdelete", isAdmin, (req, res, next) => {
  const eventid = req.rawHeaders[33].substring(28);
  // console.log(eventid);
  // console.log("-----------------------delete--------------------");
  Event.findByIdAndDelete(eventid, function (err, docs) {
    if (err) {
      console.log(err);
    } else {
      console.log("Deleted :", docs);
    }
  });
  res.send(
    `<script>alert("event deleted"); window.location.href = "/event/${eventid}"; </script>`
    );
  });
  

router.post("/event/register", isAuth, (req, res, next) => {
  console.log("----------------------hi------------------");
  const eventid = req.rawHeaders[33].substring(28);
  console.log(eventid);

  User.findById(req.user._id)
    .then((user) => {
      console.log(user);
      if (user.regEvent.includes(eventid)) {
        console.log("user already registered");
        user.regEvent.pop(eventid);
        user.save().then((user) => {
          console.log(user);
        });
        // res.send(
        //   `<script>alert("unregisterd"); window.location.href = "/event/${eventid}"; </script>`
        //   );
        // Event.populate(event);
      } else {
        user.regEvent.push(eventid);
        user.save().then((event) => {
          // Event.populate(event, {path: 'regUsers' });
          console.log(event);
        });
        // res.send(
        //   `<script>alert("registerd"); window.location.href = "/event/${eventid}"; </script>`
        //   );
      }
    })
    .catch((err) => {
      console.log(err);
    });

  Event.findById(eventid)
    .then((event) => {
      console.log(event);
      if (event.regUsers.includes(req.user._id)) {
        console.log("user already registered");
        event.regUsers.pop(req.user._id);
        event.save().then((event) => {
          console.log(event);
        });
        res.send(
          `<script>alert("unregisterd"); window.location.href = "/event/${eventid}"; </script>`
        );
        // Event.populate(event);
      } else {
        event.regUsers.push(req.user._id);
        event.save().then((event) => {
          // Event.populate(event, {path: 'regUsers' });
          console.log(event);
        });
        res.send(
          `<script>alert("registerd"); window.location.href = "/event/${eventid}"; </script>`
        );
      }
    })
    .catch((err) => {
      console.log(err);
    });

  // Event.findOne({id: req.rawHeaders[32]})
});
      
/**
 * -------------- GET ROUTES ----------------
 */

router.get("/", (req, res, next) => {
  res.sendFile(path.join(__dirname, "..", "Public/login-signup/index.html"));
});

router.get("/login", (req, res, next) => {
  res.sendFile(path.join(__dirname, "..", "Public/login-signup/index.html"));
});

router.get("/home", isAuth, (req, res, next) => {
  res.render('home/home.ejs');
  // res.sendFile(path.join(__dirname, "..", "Public/home/home.html"));
});

router.get("/event/6314dd955e0ceed240700f20", isAuth, (req, res, next) => {
  res.sendFile(path.join(__dirname, "..", "Public/Aevent/index.html"));
});
router.get("/admin/editevent/:id", isAdmin, (req, res, next) => {
  Event.findById(req.params.id,function (err, event) {
    res.render('editevent/editevent.ejs', event);
  });
});

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get(
  "/google/redirect",
  passport.authenticate("google", {
    failureRedirect: "/login-failure",
    successRedirect: "/home",
  })
);

// When you visit http://localhost:3000/register, you will see "Register Page"
// router.get('/register', (req, res, next) => {

//     const form = '<h1>Register Page</h1><form method="post" action="register">\
//                     Enter Username:<br><input type="text" name="uname">\
//                     <br>Enter Password:<br><input type="password" name="pw">\
//                     <br><br><input type="submit" value="Submit"></form>';

//     res.send(form);

// });

/**
 * Lookup how to authenticate users on routes with Local Strategy
 * Google Search: "How to use Express Passport Local Strategy"
 *
 * Also, look up what behaviour express session has without a maxage set
 */
router.get("/protected-route", isAuth, (req, res, next) => {
  res.send("You made it to the route.");
});

router.get("/admin/addevent", isAdmin, (req, res, next) => {
  res.sendFile(path.join(__dirname, "..", "Public/addevent/index.html"));
});

// Visiting this route logs the user out
router.get("/logout", (req, res, next) => {
  req.session.destroy(function () {
    console.log(
      "destroy----------------------------------------------------------------------"
    );
    res.clearCookie("connect.sid");
    res.redirect("/");
    // req.logout(function(err) {
    //     if (err) {
    //         return next(err)
    //     }
    //     res.redirect('/login');
  });
});

router.get("/login-success", (req, res, next) => {
  res.send(
    '<p>You successfully logged in. --> <a href="/protected-route">Go to protected route</a></p>'
  );
});

router.get("/login-failure", (req, res, next) => {
  res.send("You entered the wrong password.");
});

module.exports = router;
