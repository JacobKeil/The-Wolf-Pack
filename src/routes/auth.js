const router = require("express").Router();
const passport = require("passport");

const redirectLogin = (req, res, next) => {
    if(!req.user) {
      res.redirect('/auth/discord');
    } else { 
      next(); 
    }
}

router.get("/discord", passport.authenticate("discord"));

router.get("/discord/redirect", passport.authenticate("discord", {
    //successRedirect: "/",
    successReturnToOrRedirect: "/",
    failureRedirect: "/auth/discord",
    failureFlash: true
}),(req, res) => {
    res.redirect("/home");
});

router.get("/", redirectLogin, (req, res) => {
    if(req.user) {
        res.send(req.user);
    } else {
        res.send("Error on / redirect");
    }
});

module.exports = router;