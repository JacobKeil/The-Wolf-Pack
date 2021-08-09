const router = require("express").Router();

const { findOneDiscordId, 
    findOneUpdateSteam, 
    addDiscordUser,
    findTicketsById } = require("../util-functions/mongodb-functions");

const redirectLogin = (req, res, next) => {
    if(!req.user) {
      res.redirect('/auth/discord');
    } else { 
      next(); 
    }
}

router.get("/", redirectLogin, async (req, res) => {
    let steam_id;
    let tickets;
  
    await findTicketsById("users", "tickets", req.user.discordId).then(t => {
        tickets = t;
    }).catch(err => {
        console.error(err);
    });

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
      steam_id: steam_id,
      tickets: tickets
    });
  });
  
  router.post("/", redirectLogin, async (req, res) => {
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

module.exports = router;