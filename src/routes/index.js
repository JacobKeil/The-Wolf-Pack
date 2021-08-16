require("dotenv").config();

const router = require("express").Router();
const { Webhook, MessageBuilder } = require("discord-webhook-node");
const auth = require("./auth");
const admin = require("./admin");
const store = require("./store");
const user = require("./user");
const ticket = require("./ticket");

const stripePublicKey = process.env.STRIPE_PUBLIC_KEY;
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

const stripe = require("stripe")(stripeSecretKey);
const fetch = require("node-fetch");

router.use("/auth", auth);
router.use("/admin", admin);
router.use("/store", store);
router.use("/user", user);
router.use("/ticket", ticket);

const donations = require("../../json/donation.json");

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

router.get("/home", redirectLogin, async (req, res) => {
  let prices = [];

  donations.forEach(donation => {
    prices.push(donation);
  });

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
      id: req.user.discordId,
      prices: prices
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

router.get("/home/donate", redirectLogin, (req, res) => {
  const whurl = process.env.DONATION_DISCORD_WH;
  const donateHook = new Webhook(whurl);

  console.log("Donate Method Triggered");

  let api_url = `https://discord.com/api/guilds/538558092070092802/members/${req.user.discordId}/roles/864390790835208203`;

  fetch(api_url, {
    method: "PUT", 
    headers: {
      "Authorization": `Bot ${process.env.BOT_TOKEN}`
    }
  }).then(res => {
    console.log(res);
  }).catch(err => {
    console.log(err);
  });

  const donateEmbed = new MessageBuilder()
    .setTitle(`Thank you for donating!`)
    .setDescription(`<@${req.user.discordId}> sent **${req.query.price}** and was given the role <@&864390790835208203>\n\n`)
    .setColor("#d8782f")
    .setTimestamp();

  donateHook.send(donateEmbed);

  res.redirect("/thankyou");
});

router.post("/create-session", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: [
        'card',
      ],
      line_items: [
        {
          price: req.body.priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `https://www.wolfpackdayz.com/home/donate?price=${req.body.price}`,
      cancel_url: `https://www.wolfpackdayz.com/home#donate`,
    });
    res.json({ url: session.url });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;