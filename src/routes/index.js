require("dotenv").config();

const router = require("express").Router();
const { Webhook, MessageBuilder } = require("discord-webhook-node");
const auth = require("./auth");
const admin = require("./admin");
const store = require("./store");
const cors = require("cors");

const stripePublicKey = process.env.STRIPE_TEST_PUBLIC_KEY;
const stripeSecretKey = process.env.STRIPE_TEST_SECRET_KEY;

const stripe = require("stripe")(stripeSecretKey);
const fetch = require("node-fetch");
const { findOneDiscordId } = require("../util-functions/mongodb-find-one-discord-id");
const { addDiscordUser } = require("../util-functions/mongodb-update-discord-id.js");
const { findOneUpdateSteam } = require("../util-functions/mongodb-find-one-and-update-discord-id");
const { findOneTicket } = require("../util-functions/mongodb-find-one-ticket");

router.use("/auth", auth);
router.use("/admin", admin);
router.use("/store", store);

const donations = require("../../json/donation.json");

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

router.get("/user", redirectLogin, async (req, res) => {
  let steam_id;

  await findOneDiscordId("users", "discord", req.user.discordId).then(id => {
    if (!id) {
      steam_id = "No Steam ID set";
    } else {
      steam_id = id.steamId;
    }
  }).catch(err => {
    console.error(err);
  });

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
    id: req.user.discordId,
    steam_id: steam_id
  });
});

router.post("/user", redirectLogin, async (req, res) => {
  let steam_id;

  await findOneDiscordId("users", "discord", req.user.discordId).then(id => {
    if (!id) {
      steam_id = "false";
    } else {
      steam_id = id.steamId;
    }
  }).catch(err => {
    console.error(err);
  });

  if (steam_id === "false") {
    await addDiscordUser("users", "discord", req.user.discordId, req.query.steamId, req.user.discordTag).catch(err => {
      console.error(err);
    });
  } else {
    await findOneUpdateSteam("users", "discord", req.user.discordId, req.query.steamId, req.user.discordTag).then(id => {
      steam_id = id.steamId;
    }).catch(err => {
      console.error(err);
    }); 
  }

  res.send({ status: "finished" })
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

router.post("/home/donate", redirectLogin, (req, res) => {
  const whurl = process.env.DONATION_DISCORD_WH;
  const donateHook = new Webhook(whurl);
  //const un = req.user.discordTag.split("#");

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
    .setDescription(`<@${req.user.discordId}> sent **$${req.query.price}** and was given the role <@&864390790835208203>`)
    .setColor("#d8782f")
    .setTimestamp();

  donateHook.send(donateEmbed);

  res.redirect("/thankyou");
});

// router.post("/home/donate/charge", cors({ origin: "localhost:5000" }), async (req, res) => {
//   const session = await stripe.checkout.sessions.create({
//     payment_method_types: [
//       'card',
//     ],
//     line_items: [
//       {
//         price: req.query.price,
//         quantity: 1,
//       },
//     ],
//     mode: 'payment',
//     success_url: `http://172.16.1.254:3000/thankyou`,
//     cancel_url: `http://172.16.1.254:3000/home#donate`,
//   });

//   res.redirect(session.url)
// });

router.get("/ticket/:id", (req, res) => {
  findOneTicket("users", "tickets", req.params.id).then(ticket_res => {
    //console.log(ticket_res);
    res.render("ticket.ejs", {
      ticket: ticket_res
    });
  }).catch(err => {
    console.log(err);
  });
  //console.log(ticket);
});

module.exports = router;