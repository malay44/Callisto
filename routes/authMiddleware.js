module.exports.isUser = (req,res,next) => {
    User.findOne({ username: req.body.uname })
    .then((user) => {
        if (user) {
            res.send(`<script>alert("user alreay exists"); window.location.href = "/login"; </script>`); 
        } else {
            next();
        }
    }).catch((err) => done(err));
}

module.exports.isAuth = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.redirect("/login");
        // res.send(`<script>alert("please login, you're not authorised"); window.location.href = "/login"; </script>`); 
        // res.status(401).json({ msg: 'You are not authorized to view this resource' });
    }
}

module.exports.isAdmin = (req, res, next) => {
    if (req.user && (req.user.admin)) {
        next();
    } else {
        res.send(`<script>alert("please login as admin, you're not authorised"); window.location.href = "/login"; </script>`); 
        // res.status(401).json({ msg: 'You are not authorized to view this resource because you are not an admin.' });
    }
}