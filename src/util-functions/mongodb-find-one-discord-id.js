require("dotenv").config();
const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_DB_URL;
const mongoClient = new MongoClient(uri);

module.exports.findOneDiscordId = async function findOneDiscordId(db, coll, param) {
   let result;

   try {
    await mongoClient.connect();

    result = await mongoClient.db(`${db}`).collection(`${coll}`).findOne({ discordId: param });
   } catch (e) {
       console.error(e);
   } finally {
       await mongoClient.close();
   }
  return result;
}