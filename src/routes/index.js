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

const admins = ["545044271389212672", "195589455430680576"];

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
      stripePublicKey: stripePublicKey
  });
});

router.post("/donate/:price", redirectLogin, (req, res) => {
  const whurl = process.env.DONATION_DISCORD_WH;
  const donateHook = new Webhook(whurl);
  //const un = req.user.discordTag.split("#");

  console.log("Donate Method Triggered");

  let api_url = `https://discord.com/api/guilds/804540410067157002/members/${req.user.discordId}/roles/813613759209144392`;

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
    .setDescription(`<@${req.user.discordId}> sent **$${req.params.price}** and was given the role <@&813613759209144392>`)
    .setColor("#8f4aff")
    .setTimestamp();

  donateHook.send(donateEmbed);

  res.redirect("/thankyou");
});

router.post("/donate/charge/:token/:amount", async (req, res) => {
    stripe.charges.create({
      amount: req.params.amount,
      source: req.params.token,
      currency: "usd"
    }).then(() => {
      console.log("Charge Successful");

      res.redirect("/thankyou");
    })
    .catch(() => {
      console.log("Charge Failed");
    });

    //console.log(req.baseUrl);
});

router.get("/admin", redirectLogin, async (req, res) => {

  if (req.user.discordId == "195589455430680576" || req.user.discordId == "545044271389212672") {
    
  } else {
    res.redirect("/home");
    return;
  }

  let api_url = `https://discord.com/api/guilds/804540410067157002/channels`;

  let discord_ch = await fetch(api_url, {
    method: "GET", 
    headers: {
      "Authorization": `Bot ${process.env.BOT_TOKEN}`
    }
  }).then(res => {
    return res.json();
  }).then(json => {
    let channels = [];
    for(var ch of json) {
      if (ch.parent_id !== null && ch.type == 0) {
        channels.push(ch);
      }
    }

    return channels;
  }).catch(err => {
    console.log(err);
  });

  //console.log(discord_ch);

  //console.log(disc_channels);

  let profilePic = "";
  if (req.user.avatar == null) {
    profilePic = "images/default.png";
  } else {
    profilePic = `https://cdn.discordapp.com/avatars/${req.user.discordId}/${req.user.avatar}`;
  }
  const un = req.user.discordTag.split("#");
  res.render("embed.ejs", {
      username: un[0],
      email: req.user.email,
      avatar: `<img id="user-logo" src="${profilePic}">`,
      guilds: req.user.guilds,
      id: req.user.discordId,
      channels: discord_ch
  });
});

router.post("/admin/post/:channel", (req, res) => {
  let api_url = `https://discord.com/api/channels/${req.params.channel}/messages`;

  fetch(api_url, {
    method: "POST", 
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bot ${process.env.BOT_TOKEN}`
    },
    body: JSON.stringify({
        content: `${req.body.content}`,
        embed: {
            title: `${req.body.embed.title}`,
            description: `${req.body.embed.description}`,
            footer: {
              icon_url: "https://cdn.discordapp.com/avatars/805015249975640084/2db43b8b295d69f6c1c50aa0f1bfd763",
              text: "Comrade"
            }
        }
    })
  }).then(res => {
    return;
    //console.log(res);
  }).catch(err => {
    console.log(err);
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

module.exports = router;