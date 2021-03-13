require("dotenv").config();

const router = require("express").Router();
const { Webhook, MessageBuilder } = require("discord-webhook-node");
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

router.get("/logout", (req, res) => {
  res.clearCookie("connect.sid");
  res.redirect("/");
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
        email: req.user.email,
        avatar: `<img id="user-logo" src="${profilePic}">`,
        guilds: req.user.guilds,
        id: req.user.discordId
    });
});

router.get("/donate", redirectLogin, (req, res) => {
  //console.log(req.user.avatar);
  let profilePic = "";
  if (req.user.avatar == null) {
    profilePic = "images/default.png";
  } else {
    profilePic = `https://cdn.discordapp.com/avatars/${req.user.discordId}/${req.user.avatar}`;
  }
  const un = req.user.discordTag.split("#");
  res.render("donate.ejs", {
      username: un[0],
      email: req.user.email,
      avatar: `<img id="user-logo" src="${profilePic}">`,
      guilds: req.user.guilds,
      id: req.user.discordId
  });
});

router.get("/donate/send", redirectLogin, (req, res) => {
  const whurl = process.env.DONATION_DISCORD_WH;
  const donateHook = new Webhook(whurl);
  const un = req.user.discordTag.split("#");

  const donateEmbed = new MessageBuilder()
    .setTitle(`Thank you ${un[0]}`)
    .setDescription(`Donation was sent by <@${req.user.discordId}>`)
    .setTimestamp();

  donateHook.send(donateEmbed);

  res.redirect("/donate/thankyou");
});

router.get("/donate/thankyou", redirectLogin, (req, res) => {
  res.send("Thank you!")
});

module.exports = router;