require("dotenv").config();
const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_DB_URL;
const mongoClient = new MongoClient(uri);

module.exports.addDiscordUser = async function addDiscordUser(db, coll, discordId, steamId, user) {
   try {
    await mongoClient.connect();

    await mongoClient.db(`${db}`).collection(`${coll}`).insertOne({ 
        user: user,
        discordId: discordId,
        steamId: steamId,
        credits: 100
    });
   } catch (e) {
       console.error(e);
   } finally {
       await mongoClient.close();
   }

  return "User Added";
}