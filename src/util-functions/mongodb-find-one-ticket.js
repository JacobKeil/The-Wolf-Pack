require("dotenv").config();
const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_DB_URL;
const mongoClient = new MongoClient(uri);

module.exports.findOneTicket = async function findOneTicket(db, coll, param) {
   let result;

   try {
    await mongoClient.connect();
    result = await mongoClient.db(`${db}`).collection(`${coll}`).findOne({ ticketId: param });
   } catch (e) {
       console.error(e);
   } finally {
       await mongoClient.close();
   }
  return result;
}