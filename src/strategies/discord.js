const passport = require("passport");
const DiscordStrategy = require("passport-discord");
const User = require("../database/schemas/User");

const { addDiscordUser } = require("../util-functions/mongodb-functions");

passport.serializeUser((user, done) => {
    done(null, user.discordId);
});

passport.deserializeUser(async (discordId, done) => {
    try {
        const user = await User.findOne({ discordId });
        return user ? done(null, user) : done(null, null);
    } catch (error) {
        console.log("Deserialize Error");
        console.log(error);
        done(err, null);
    }
});

passport.use(new DiscordStrategy({
    clientID: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    callbackURL: process.env.DISCORD_CALLBACK_URL,
    scope: ["identify", "guilds", "email"]
}, async (accessToken, refreshToken, profile, done) => {
    const { id, username, discriminator, avatar, guilds, email } = profile;
    //console.log(id, username, guilds);
    try {
        const findUser = await User.findOneAndUpdate({ discordId: id }, {
            discordTag: `${username}#${discriminator}`,
            avatar,
            email,
            guilds,
        }, { new: true });
        if (findUser) {
            console.log("User Found");
            return done(null, findUser);
        } else {
            await addDiscordUser("users", "discord", id, "", `${username}#${discriminator}`);
            const newUser = await User.create({
                discordId: id,
                discordTag: `${username}#${discriminator}`,
                avatar,
                email,
                guilds,
            });
            return done(null, newUser);
        }


    } catch (err) {
        console.log("Strategy Error");
        console.log(err);
        return done(err, null);
    }
  })
);