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

router.post("/login",
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
          email: req.body.Email,
          number: req.body.Number,
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

router.get("/home",isAuth, (req, res, next) => {
  Event.find().then((events)=>{
    // res.send(events);
    console.log(events);
    res.render('home/home.ejs',{events: events});
  })
});

router.get("/myprofile", isAuth, (req, res, next) => {
  User.findById(req.user._id)
    .populate({ path: "regEvent", select: ["artist", "_id", "name","discription","briefdiscription","photo","time"] })
    .exec((err, docs) => {
      if (err) throw err;
      // res.send(docs);
      console.log(docs);
      res.render('myprofile/myprofile.ejs',{user: docs,});
    });
  // res.sendFile(path.join(__dirname, "..", "Public/myprofile/myprofile.html"));
});

router.get("/event/:id", isAuth, (req, res, next) => {
  Event.findById(req.params.id, function (err, event) {
    User.findById(req.user._id).then((user) => {
      if (user.admin) {
        res.render("Aevent/index.ejs",event);
        // res.sendFile(path.join(__dirname, "..", "Public/Aevent/index.html"));
      } else {
        res.render("Uevent/index.ejs",event);
        // res.sendFile(path.join(__dirname, "..", "Public/Uevent/index.html"));
      }
    });
  });
});

router.get("/api", (req, res, next) => {
  res.json.send({
    results: [
      {
        gender: "male",
        name: { title: "Mr", first: "Jorge", last: "Márquez" },
        location: {
          street: { number: 2519, name: "Calle de La Democracia" },
          city: "Móstoles",
          state: "Navarra",
          country: "Spain",
          postcode: 90582,
          coordinates: { latitude: "-34.0018", longitude: "-143.6928" },
          timezone: {
            offset: "+11:00",
            description: "Magadan, Solomon Islands, New Caledonia",
          },
        },
        email: "jorge.marquez@example.com",
        login: {
          uuid: "98f489ee-2cec-4951-86f9-9a9c25750568",
          username: "whitemeercat627",
          password: "galaxy",
          salt: "kV6XKveq",
          md5: "16c35a807f58245b55bd9b5a7cc529eb",
          sha1: "34862983b5276d6b129ac278894af7bb9e0861a1",
          sha256:
            "e77b7cf2eb096cda053772235784193bee2716e624e16cd8ae3ad4c7a5219a01",
        },
        dob: { date: "1983-01-20T17:51:47.461Z", age: 39 },
        registered: { date: "2014-09-11T01:33:09.131Z", age: 8 },
        phone: "913-430-335",
        cell: "684-614-633",
        id: { name: "DNI", value: "17225071-U" },
        picture: {
          large: "https://randomuser.me/api/portraits/men/81.jpg",
          medium: "https://randomuser.me/api/portraits/med/men/81.jpg",
          thumbnail: "https://randomuser.me/api/portraits/thumb/men/81.jpg",
        },
        nat: "ES",
      },
    ],
    info: { seed: "fadee30557ac04eb", results: 1, page: 1, version: "1.4" },
  });
});
router.get("/admin/editevent/:id", isAdmin, (req, res, next) => {
  Event.findById(req.params.id,function (err, event) {
    res.render('editevent/editevent.ejs', event);
  });
});

router.get("/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get("/google/redirect",
  passport.authenticate("google", {
    failureRedirect: "/login-failure",
    successRedirect: "/home",
  })
);

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
