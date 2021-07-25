require("dotenv").config();
const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_DB_URL;
const mongoClient = new MongoClient(uri);

module.exports.findAll = async function findAll(db, coll) {
   let result = [];

   try {
    await mongoClient.connect();

    result = await mongoClient.db(`${db}`).collection(`${coll}`).find().toArray();
   } catch (e) {
       console.error(e);
   } finally {
       await mongoClient.close();
   }
  return result;
}