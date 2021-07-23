require("dotenv").config();
const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_DB_URL;
const mongoClient = new MongoClient(uri);

module.exports = async function findOneSteam(reqId) {
   let steam;

   try {
    await mongoClient.open();

    steam = await mongoClient.db("users").collection("discord").findOne({ discordId: reqId });
   } catch (e) {
       console.error(e);
   } finally {
       await mongoClient.close();
   }
   console.log(steam);
  return steam;
}

