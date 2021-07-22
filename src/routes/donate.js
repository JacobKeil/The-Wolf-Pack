require("dotenv").config();
const router = require("express").Router();

const { Webhook, MessageBuilder } = require("discord-webhook-node");
const convert = require("hex2dec");

const stripePublicKey = process.env.STRIPE_TEST_PUBLIC_KEY;
const stripeSecretKey = process.env.STRIPE_TEST_SECRET_KEY;

const stripe = require("stripe")(stripeSecretKey);
const fetch = require("node-fetch");

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

  router.get("/", redirectLogin, (req, res) => {
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

  router.post("/:price", redirectLogin, (req, res) => {
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
      .setDescription(`<@${req.user.discordId}> sent **$${req.params.price}** and was given the role <@&864390790835208203>`)
      .setColor("#8f4aff")
      .setTimestamp();
  
    donateHook.send(donateEmbed);
  
    res.redirect("/thankyou");
  });
  
  router.post("/charge/:token/:amount", async (req, res) => {
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

module.exports = router;