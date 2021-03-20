require("dotenv").config();

const router = require("express").Router();
const { Webhook, MessageBuilder } = require("discord-webhook-node");
const auth = require("./auth");
const discord = require("./discord");

const stripePublicKey = process.env.STRIPE_PUBLIC_KEY;
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

const stripe = require("stripe")(stripeSecretKey);
const fetch = require("node-fetch");

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
      id: req.user.discordId,
      stripePublicKey: process.env.STRIPE_PUBLIC_KEY,
  });
});

router.post("/donate/send/:price", redirectLogin, async (req, res) => {
  const whurl = process.env.DONATION_DISCORD_WH;
  const donateHook = new Webhook(whurl);
  const un = req.user.discordTag.split("#");
  let isInt = parseInt(req.params.price);
  let isFloat = parseFloat(req.params.price);
  let amount = "";

  const api_url = `https://discord.com/api/guilds/804540410067157002/members/${req.user.discordId}/roles/813613759209144392`

  fetch(api_url, { 
    method: 'PUT', 
    headers: { 
      'Authorization': `Bot ${process.env.bot_token}`
    }
  });

  if(isInt) {
    amount = req.params.price + ".00";
  }
  if(isFloat) {
    amount = req.params.price;
  }

  const donateEmbed = new MessageBuilder()
    .setTitle(`Thank you for donating!`)
    .setDescription(`<@${req.user.discordId}> sent **$${amount}** and was given the role <@&813613759209144392>`)
    .setColor("#8f4aff")
    .setTimestamp();

  donateHook.send(donateEmbed);

  res.redirect("/donate/thankyou");
});

router.post("/donate/charge/:token/:amount", async (req, res) => {
    stripe.charges.create({
      amount: req.params.amount,
      source: req.params.token,
      currency: "usd"
    }).then(() => {
      console.log("Charge Successful");

      res.redirect("/donation/successful");
    })
    .catch(() => {
      console.log("Charge Failed");
    });

    //console.log(req.baseUrl);
});

router.get("/donation/successful", (req, res) => {
  res.send("Thank you for donating");
})

module.exports = router;