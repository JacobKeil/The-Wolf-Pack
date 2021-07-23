require("dotenv").config();
const router = require("express").Router();
const { MongoClient } = require("mongodb");

const server_id = "9af57c49e9edd25ece64988aaf6c50ac1d5e6b10";
const uri = process.env.MONGO_DB_URL;
const mongoClient = new MongoClient(uri);
const fetch = require("node-fetch");
const { findOneSteam } = require("../util-functions/mongodb-find-one");

let items = [];
let token = "";
let steamID = "";

async function runMongo() {
  await mongoClient.connect().then(res => {
      console.log(res);
  }).catch(err => {
      console.log(err);
  });
  items = await mongoClient.db("store").collection("items").find().toArray().then(res => {
    console.log("items retrieved");
  }).catch(err => {
    console.log(err);
  });;
  token = await mongoClient.db("environment").collection("variables").findOne({ server_id: server_id }).then(res => {
    console.log("token retrieved");
  }).catch(err => {
    console.log(err);
  });
  await mongoClient.close().then(res => {
    console.log(res);
}).catch(err => {
    console.log(err);
});
}

const redirectLogin = (req, res, next) => {
    if(!req.user) {
      res.redirect('/auth/discord');
    } else { 
      next(); 
    }
}

router.get("/", redirectLogin, async (req, res) => {
    await runMongo();
    await findOneSteam(req.user.discordId).then(id => {
        steamID = id.steamId;
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
  
  router.post("/", (req, res) => {
    console.log(req.query.object);
    console.log(req.query.quantity);
    console.log(req.query.cost);
  
    let api_url_base = "https://data.cftools.cloud";
    let gamesession;

    fetch(`${api_url_base}/v1/server/3ba3e6d8-79fe-4118-a305-c23f50baf6bf/GSM/list`, {
      method: "GET", 
      headers: {
        "Authorization": `Bearer ${token.api_token}`
      }
    }).then(res => {
      res.json()
      .then((json) => {
          console.log(json);
        json.sessions.forEach(session => {
            if(session.gamedata.steam64 === steamID) {
                gamesession = session.id;
      
                fetch(`${api_url_base}/v0/server/3ba3e6d8-79fe-4118-a305-c23f50baf6bf/gameLabs/spawn`, {
                  method: "POST", 
                  headers: {
                    "Authorization": `Bearer ${token.api_token}`
                  },
                  body: JSON.stringify({
                      gamesession_id: gamesession,
                      object: req.query.object,
                      quantity: req.query.quantity
                  })
                }).then(res => {
                  console.log(`SPAWNED: ${res}`)
                }).catch(err => {
                  console.error(err);
                });
              }
        });
      });
    }).catch(err => {
      console.log(err);
    });
  });

module.exports = router;