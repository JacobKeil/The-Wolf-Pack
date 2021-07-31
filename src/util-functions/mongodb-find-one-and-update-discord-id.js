require("dotenv").config();
const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_DB_URL;
const mongoClient = new MongoClient(uri);

module.exports.findOneUpdateSteam = async function findOneUpdateSteam(db, coll, discordId, steamId, user) {
   try {
    await mongoClient.connect();

    await mongoClient.db(`${db}`).collection(`${coll}`).findOneAndUpdate(
        { discordId: discordId },
        { $set: { steamId: steamId, user: user } }
    );
   } catch (e) {
       console.error(e);
   } finally {
       await mongoClient.close();
   }
  return "Steam ID Updated";
}