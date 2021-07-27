require("dotenv").config();
const router = require("express").Router();

const { CFToolsClientBuilder, SteamId64 } = require("cftools-sdk");
const { findAll } = require("../util-functions/mongodb-get-all");
const { findOneDiscordId } = require("../util-functions/mongodb-find-one-discord-id");
const { updateCurrency } = require("../util-functions/mongodb-subtract-currency");

const client = new CFToolsClientBuilder()
    .withServerApiId('3ba3e6d8-79fe-4118-a305-c23f50baf6bf')
    .withCredentials('60f26c966adf7a59ade2303f', 'bn2G3i8w13WDapW8dsUIG9IPzRnzMEZSfJxe12wXMWA=');

let items = [];
let steamID = "";

const redirectLogin = (req, res, next) => {
    if(!req.user) {
      res.redirect('/auth/discord');
    } else { 
      next(); 
    }
}

router.get("/", redirectLogin, async (req, res) => {
    let credits = "";

    await findAll("store", "items").then(r => {
      items = r;
    }).catch(err => {
      console.error(err);
    });

    await findOneDiscordId("users", "discord", req.user.discordId).then(id => {
      credits = id.credits;
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
    res.render("store.ejs", {
        username: un[0],
        avatar: `<img id="user-logo" src="${profilePic}">`,
        id: req.user.discordId,
        items: items,
        credits: credits
    });
  });
  
  router.post("/", async (req, res) => {
    try {
      await findOneDiscordId("users", "discord", req.user.discordId).then(id => {
          steamID = id.steamId;
          //console.log(steamID);
      }).catch(err => {
          console.error(err);
      });
  
      client.build().listGameSessions().then(sessions => {
        sessions.forEach(session => {
          if(session.steamId.id === steamID) {
              client.build().spawnItem({
                session: session,
                itemClass: req.query.object
              }).catch(err => {
                console.error(err);
              });
          }
        })
      })

      await updateCurrency("users", "discord", req.user.discordId, req.query.price).then(res => {
        console.log(res);
      });
    } catch (error) {
      console.log(error);
    }
  });

module.exports = router;