require('dotenv').config();
const router = require('express').Router();

const { CFToolsClientBuilder, SteamId64 } = require('cftools-sdk');
const {
  findOneDiscordId,
  updateCurrency,
} = require('../util-functions/mongodb-functions');
const store_items = require('../../json/items.json');
const connectEnsureLogin = require('connect-ensure-login');

const chernarus = new CFToolsClientBuilder()
  .withServerApiId('a727a96d-c394-4c98-b147-cd0c14d81bb0')
  .withCredentials(
    '6118984a902b7fc0b2a5d019',
    '8rWjcn9uoUG8xTb1eQkaFhySCoHZ2l2RPjaL4QHWMEQ='
  );

const takistan = new CFToolsClientBuilder()
  .withServerApiId('48d57ee6-f4db-4d48-9856-f64fd1d3ee31')
  .withCredentials(
    '6118984a902b7fc0b2a5d019',
    '8rWjcn9uoUG8xTb1eQkaFhySCoHZ2l2RPjaL4QHWMEQ='
  );

const deerisle = new CFToolsClientBuilder()
  .withServerApiId('085e7c67-deeb-4d17-8486-3b19c32eadaa')
  .withCredentials(
    '6118984a902b7fc0b2a5d019',
    '8rWjcn9uoUG8xTb1eQkaFhySCoHZ2l2RPjaL4QHWMEQ='
  );

let steamID = '';
let stServer = 'user-not-in-server';

const redirectLogin = (req, res, next) => {
  if (!req.user) {
    res.redirect('/auth/discord');
  } else {
    next();
  }
};

router.get(
  '/',
  connectEnsureLogin.ensureLoggedIn({ redirectTo: '/' }),
  async (req, res) => {
    let steamId;
    let credits;
    let items = [];

    store_items.forEach((store_item) => {
      items.push(store_item);
    });

    let user = await findOneDiscordId('users', 'discord', req.user.discordId);

    if (user.steamId != '') {
      steamId = user.steamId;
    } else {
      steamId = 'not-found';
    }

    let profilePic = '';
    if (req.user.avatar == null) {
      profilePic = 'images/default.png';
    } else {
      profilePic = `https://cdn.discordapp.com/avatars/${req.user.discordId}/${req.user.avatar}`;
    }
    const un = req.user.discordTag.split('#');
    res.render('store.ejs', {
      username: un[0],
      avatar: `<img id="user-logo" src="${profilePic}">`,
      id: req.user.discordId,
      items: items,
      credits: user.credits,
      steamId: steamId,
    });
  }
);

router.post('/', async (req, res) => {
  try {
    let currency = true;
    let stDiscord = '';

    if (req.query.credits - req.query.price < 0) {
      currency = false;
    }

    await findOneDiscordId('users', 'discord', req.user.discordId)
      .then((id) => {
        if (id === undefined) {
          stDiscord = 'steam-id-not-found';
        } else {
          stDiscord = 'steam-id-found';
        }
        steamID = id.steamId;
      })
      .catch((err) => {
        console.error(err);
      });

    await chernarus
      .build()
      .listGameSessions()
      .then((sessions) => {
        sessions.forEach(async (session) => {
          if (session.steamId.id === steamID && currency === true) {
            await chernarus
              .build()
              .spawnItem({
                session: session,
                itemClass: req.query.object,
              })
              .catch((err) => {
                console.error(err);
              });
            stServer = 'user-in-server';
            await updateCurrency(
              'users',
              'discord',
              req.user.discordId,
              req.query.price
            );
          }
        });
      });

    await takistan
      .build()
      .listGameSessions()
      .then((sessions) => {
        sessions.forEach(async (session) => {
          if (session.steamId.id === steamID && currency === true) {
            await takistan
              .build()
              .spawnItem({
                session: session,
                itemClass: req.query.object,
              })
              .catch((err) => {
                console.error(err);
              });
            stServer = 'user-in-server';
            await updateCurrency(
              'users',
              'discord',
              req.user.discordId,
              req.query.price
            );
          }
        });
      });

    await deerisle
      .build()
      .listGameSessions()
      .then((sessions) => {
        sessions.forEach(async (session) => {
          if (session.steamId.id === steamID && currency === true) {
            await deerisle
              .build()
              .spawnItem({
                session: session,
                itemClass: req.query.object,
              })
              .catch((err) => {
                console.error(err);
              });
            stServer = 'user-in-server';
            await updateCurrency(
              'users',
              'discord',
              req.user.discordId,
              req.query.price
            );
          }
        });
      });

    res.send({
      statusDiscord: `${stDiscord}`,
      statusServer: `${stServer}`,
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
