require("dotenv").config();
const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_DB_URL;
const mongoClient = new MongoClient(uri);

module.exports.findOneServerId = async function findOneServerId(db, coll, param) {
   let result;

   try {
    await mongoClient.connect();

    result = await mongoClient.db(`${db}`).collection(`${coll}`).findOne({ server_id: param });
   } catch (e) {
       console.error(e);
   } finally {
       await mongoClient.close();
   }
  return result;
}