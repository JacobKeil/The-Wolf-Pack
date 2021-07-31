const router = require("express").Router();

const { Webhook, MessageBuilder } = require("discord-webhook-node");
const convert = require("hex2dec");
const fetch = require("node-fetch");

const admins = ["195589455430680576", 
                "545044271389212672",
                "261717655180804097",
                "303315367852507136",
                "356316542423793665"];

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

router.get("/", redirectLogin, async (req, res) => {

    let isAdmin;

    if (req.user.discordId == "195589455430680576" || 
        req.user.discordId == "545044271389212672" || 
        req.user.discordId == "261717655180804097" ||
        req.user.discordId == "303315367852507136") {
    } else {
      res.redirect("/home");
      return;
    }
  
    let api_url = `https://discord.com/api/guilds/538558092070092802/channels`;
  
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
  
    let profilePic = "";
    if (req.user.avatar == null) {
      profilePic = "images/default.png";
    } else {
      profilePic = `https://cdn.discordapp.com/avatars/${req.user.discordId}/${req.user.avatar}`;
    }
    const un = req.user.discordTag.split("#");
    res.render("admin.ejs", {
        username: un[0],
        email: req.user.email,
        avatar: `<img id="user-logo" src="${profilePic}">`,
        guilds: req.user.guilds,
        id: req.user.discordId,
        channels: discord_ch
    });
  });

  router.post("/post/:channel", (req, res) => {
    let api_url = `https://discord.com/api/channels/${req.params.channel}/messages`;
  
    var colorHex = req.body.embed.color;
    var colorDec = convert.hexToDec(colorHex.replace("#", ""));
  
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
              color: colorDec,
              footer: {
                text: "Wolfy"
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

module.exports = router;