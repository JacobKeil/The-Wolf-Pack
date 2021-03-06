const router = require('express').Router();

const { Webhook, MessageBuilder } = require('discord-webhook-node');
const convert = require('hex2dec');
const fetch = require('node-fetch');
const {
  findAll,
  addCurrency,
  addCreditsAll,
} = require('../util-functions/mongodb-functions');
const connectEnsureLogin = require('connect-ensure-login');

const admins = [
  '195589455430680576',
  '545044271389212672',
  '261717655180804097',
  '303315367852507136',
  '356316542423793665',
];

const redirectHome = (req, res, next) => {
  if (req.user) {
    res.redirect('/home');
  } else {
    next();
  }
};

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
    let discord;
    let tickets;

    await findAll('users', 'tickets')
      .then((t) => {
        tickets = t;
      })
      .catch((err) => {
        console.error(err);
      });

    await findAll('users', 'discord')
      .then((d) => {
        discord = d;
      })
      .catch((err) => {
        console.error(err);
      });

    if (
      req.user.discordId == '195589455430680576' ||
      req.user.discordId == '545044271389212672' ||
      req.user.discordId == '261717655180804097' ||
      req.user.discordId == '303315367852507136'
    ) {
    } else {
      res.redirect('/home');
      return;
    }

    let api_url = `https://discord.com/api/guilds/845509436373205052/channels`;

    let discord_ch = await fetch(api_url, {
      method: 'GET',
      headers: {
        Authorization: `Bot ${process.env.BOT_TOKEN}`,
      },
    })
      .then((res) => {
        console.log(res);
        return res.json();
      })
      .then((json) => {
        console.log(json);
        let channels = [];
        for (var ch of json) {
          if (ch.parent_id !== null && ch.type == 0) {
            channels.push(ch);
          }
        }

        return channels;
      })
      .catch((err) => {
        console.log(err);
      });

    let profilePic = '';
    if (req.user.avatar == null) {
      profilePic = 'images/default.png';
    } else {
      profilePic = `https://cdn.discordapp.com/avatars/${req.user.discordId}/${req.user.avatar}`;
    }
    const un = req.user.discordTag.split('#');
    res.render('admin.ejs', {
      username: un[0],
      email: req.user.email,
      avatar: `<img id="user-logo" src="${profilePic}">`,
      guilds: req.user.guilds,
      id: req.user.discordId,
      channels: discord_ch,
      discord_users: discord,
      tickets: tickets,
    });
  }
);

router.post('/post/:channel', (req, res) => {
  let api_url = `https://discord.com/api/channels/${req.params.channel}/messages`;

  var colorHex = req.body.embed.color;
  var colorDec = convert.hexToDec(colorHex.replace('#', ''));

  fetch(api_url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bot ${process.env.BOT_TOKEN}`,
    },
    body: JSON.stringify({
      content: `${req.body.content}`,
      embed: {
        title: `${req.body.embed.title}`,
        description: `${req.body.embed.description}`,
        color: colorDec,
        footer: {
          text: 'Wolfy',
        },
      },
    }),
  })
    .then((res) => {
      return;
      //console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post('/user/add', async (req, res) => {
  if (req.query.discordId === 'all') {
    await addCreditsAll(parseInt(req.query.credits));
    return;
  }
  await addCurrency(
    'users',
    'discord',
    req.query.discordId,
    parseInt(req.query.credits)
  );
  res.send({ status: 'Currency Added' });
});

module.exports = router;
