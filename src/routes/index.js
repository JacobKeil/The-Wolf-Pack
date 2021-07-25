require("dotenv").config();

const router = require("express").Router();
const { Webhook, MessageBuilder } = require("discord-webhook-node");
const auth = require("./auth");
const donate = require("./donate");
const admin = require("./admin");
const store = require("./store");
const { MongoClient } = require("mongodb");

const stripePublicKey = process.env.STRIPE_TEST_PUBLIC_KEY;
const stripeSecretKey = process.env.STRIPE_TEST_SECRET_KEY;

const stripe = require("stripe")(stripeSecretKey);
const fetch = require("node-fetch");

router.use("/auth", auth);
router.use("/donate", donate);
router.use("/admin", admin);
router.use("/store", store);

const admins = ["545044271389212672", "195589455430680576"];

function redirect(endpoint) {
  const redirect = (req, res, next) => {
    if(req.user) {
      res.redirect(endpoint);
    } else { 
      next();
    }
  }
  return redirect;
}

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

router.get("/logout", (req, res) => {
  res.clearCookie("connect.sid");
  res.redirect("/");
});

router.get("/home", redirectLogin, (req, res) => {
  //console.log(req.user.avatar);
  let profilePic = "";
  if (req.user.avatar == null) {
    profilePic = "images/default.png";
  } else {
    profilePic = `https://cdn.discordapp.com/avatars/${req.user.discordId}/${req.user.avatar}`;
  }
  const un = req.user.discordTag.split("#");
  res.render("home.ejs", {
      username: un[0],
      avatar: `<img id="user-logo" src="${profilePic}">`,
      stripePublicKey: stripePublicKey,
      id: req.user.discordId
  });
});

router.get("/user", redirectLogin, (req, res) => {
  let profilePic = "";
    if (req.user.avatar == null) {
      profilePic = "images/default.png";
    } else {
      profilePic = `https://cdn.discordapp.com/avatars/${req.user.discordId}/${req.user.avatar}`;
    }
  const un = req.user.discordTag.split("#");
  res.render("user.ejs", {
    username: un[0],
    email: req.user.email,
    avatar: `<img id="user-logo" src="${profilePic}">`,
    guilds: req.user.guilds,
    id: req.user.discordId
  });
});

router.get("/thankyou", (req, res) => {
  let profilePic = "";
  if (req.user.avatar == null) {
    profilePic = "images/default.png";
  } else {
    profilePic = `https://cdn.discordapp.com/avatars/${req.user.discordId}/${req.user.avatar}`;
  }
  const un = req.user.discordTag.split("#");
  res.render("thankyou.ejs", {
      username: un[0],
      email: req.user.email,
      avatar: `<img id="user-logo" src="${profilePic}">`,
      guilds: req.user.guilds,
      id: req.user.discordId
  });
});

router.get("/thankyou", (req, res) => {
  res.send({ msg: "WORKED LIKE A CHARM", status: 200 })
});

module.exports = router;