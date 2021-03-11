const router = require("express").Router();
const passport = require("passport");

const redirectLogin = (req, res, next) => {
    if(!req.user) {
      res.redirect('/auth/discord');
    } else { 
      next(); 
    }
}

router.get("/discord", passport.authorize("discord"));

router.get("/discord/redirect", passport.authorize("discord"),(req, res) => {
    res.redirect("/home");
});

router.get("/", redirectLogin, (req, res) => {
    if(req.user) {
        res.send(req.user);
    } else {
        res.sendStatus(401);
    }
});

module.exports = router;