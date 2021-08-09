require("dotenv").config();
const router = require("express").Router();

const { CFToolsClientBuilder, SteamId64 } = require("cftools-sdk");
const { findOneDiscordId, updateCurrency } = require("../util-functions/mongodb-functions");
const store_items = require("../../json/items.json");

const client = new CFToolsClientBuilder()
    .withServerApiId('3ba3e6d8-79fe-4118-a305-c23f50baf6bf')
    .withCredentials('60f26c966adf7a59ade2303f', 'bn2G3i8w13WDapW8dsUIG9IPzRnzMEZSfJxe12wXMWA=');

let steamID = "";

const redirectLogin = (req, res, next) => {
    if(!req.user) {
      res.redirect('/auth/discord');
    } else { 
      next(); 
    }
}

router.get("/", redirectLogin, async (req, res) => {
    let credits;
    let items = [];

    store_items.forEach(store_item => {
      items.push(store_item);
    });

    await findOneDiscordId("users", "discord", req.user.discordId).then(id => {
      if (!id) {
        credits = "false";
      } else {
        credits = id.credits;
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
    res.render("store.ejs", {
        username: un[0],
        avatar: `<img id="user-logo" src="${profilePic}">`,
        id: req.user.discordId,
        items: items,
        credits: credits
    });
  });
  
  router.post("/", async (req, res) => {
    let currency = true;
    let stDiscord = "";
    let stServer = "user-not-in-server";

    try {
      if (req.query.credits - req.query.price < 0) {
        currency = false;
      }

      await findOneDiscordId("users", "discord", req.user.discordId).then(id => {
          if (id === undefined) {
            stDiscord = "steam-id-not-found";
          } else { 
            stDiscord = "steam-id-found";
          }
          steamID = id.steamId;
      }).catch(err => {
          console.error(err);
      });
  
      client.build().listGameSessions().then(sessions => {
        sessions.forEach(async session => {
          if(session.steamId.id === steamID && currency === true) {
              client.build().spawnItem({
                session: session,
                itemClass: req.query.object
              }).catch(err => {
                console.error(err);
              });

              stServer = "user-in-server";

              await updateCurrency("users", "discord", req.user.discordId, req.query.price);
          }
        })
      })

      res.send({ 
        statusDiscord: `${stDiscord}`,
        statusServer: `${stServer}`
      })
    } catch (error) {
      console.log(error);
    }
  });

module.exports = router;