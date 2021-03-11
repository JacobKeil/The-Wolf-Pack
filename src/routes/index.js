const router = require("express").Router();
const auth = require("./auth");
const discord = require("./discord");

router.use("/auth", auth);
router.use("/discord", discord);

const redirectHome = (req, res, next) => {
    if(req.user) {
      res.redirect('/home');
    } else { 
      next();
    }
}

const redirectLogin = (req, res, next) => {
    if(!req.user) {
      res.redirect('/auth/discord');
    } else { 
      next();
    }
}

router.get("/", redirectHome, (req, res) => {
    res.render("index.ejs");
});

router.get("/home", redirectLogin, (req, res) => {
    //console.log(req.user);
    //res.send(req.user);
    const un = req.user.discordTag.split("#");
    res.render("home.ejs", {
        username: un[0],
        id: req.user.discordId
    });
});

module.exports = router;