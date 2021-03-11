const router = require("express").Router();
const passport = require("passport");

const redirectLogin = (req, res, next) => {
    if(!req.user) {
      res.redirect('/auth/discord');
    } else { 
      next(); 
    }
}

const redirectAuth = (req, res, next) => {
    res.redirect(
        "https://discord.com/api/oauth2/authorize?client_id=805015249975640084&redirect_uri=https%3A%2F%2Fcomrades-cove.herokuapp.com%2Fauth%2Fdiscord%2Fredirect&response_type=code&scope=identify%20guilds"
        );
}

router.get("/discord", redirectAuth);

router.get("/discord/redirect", redirectAuth,(req, res) => {
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