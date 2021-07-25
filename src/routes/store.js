require("dotenv").config();
const router = require("express").Router();

const server_id = "9af57c49e9edd25ece64988aaf6c50ac1d5e6b10";
const uri = process.env.MONGO_DB_URL;
const fetch = require("node-fetch");
const { postSpawn } = require("../util-functions/api-post-request");
const { findAll } = require("../util-functions/mongodb-get-all");
const { findOneDiscordId } = require("../util-functions/mongodb-find-one-discord-id");
const { findOneServerId } = require("../util-functions/mongodb-find-one-server-id");

let items = [];
let token = "";
let steamID = "";

const redirectLogin = (req, res, next) => {
    if(!req.user) {
      res.redirect('/auth/discord');
    } else { 
      next(); 
    }
}

router.get("/", redirectLogin, async (req, res) => {
    await findAll("store", "items").then(r => {
      items = r;
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
        items: items
    });
  });
  
  router.post("/", async (req, res) => {
    try {
      let api_url_base = "https://data.cftools.cloud";
      let gamesession;
  
      await findOneDiscordId("users", "discord", req.user.discordId).then(id => {
          steamID = id.steamId;
          console.log(steamID);
      }).catch(err => {
          console.error(err);
      });

      await findOneServerId("environment", "variables", server_id).then(t => {
        token = t;
      }).catch(err => {
        console.error(err);
      });
  
      await fetch(`${api_url_base}/v1/server/3ba3e6d8-79fe-4118-a305-c23f50baf6bf/GSM/list`, {
          method: "GET", 
          headers: {
            "Authorization": `Bearer ${token.api_token}`,
            "Access-Control-Allow-Origin": "https://the-wolfpack.herokuapp.com"
          }
        }).then(res => {
          res.json()
          .then((json) => {
            if(!json.sessions) {
              console.log("No Sessions Found");
              console.log(json);
              console.log(token.api_token);
            }
            json.sessions.forEach((session) => {
                if(session.gamedata.steam64 === steamID) {
                    gamesession = session.id;
  
                    postSpawn(api_url_base, token.api_token, gamesession, req.query.object, req.query.quantity);
                }
            })
          }).catch(err => {
            console.error(err);
          })
        }).catch(err => {
          console.log(err);
        }); 
    } catch (error) {
      console.log(error);
    }
  });

module.exports = router;