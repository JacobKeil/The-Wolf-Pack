require("dotenv").config();
const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_DB_URL;
const mongoClient = new MongoClient(uri);

module.exports.addCurrency = async function addCurrency(db, coll, param, curr) {
   try {
    await mongoClient.connect();
    await mongoClient.db(`${db}`).collection(`${coll}`).findOneAndUpdate(
        { discordId: param }, 
        { $inc: { credits: curr } })
   } catch (e) {
       console.error(e);
   } finally {
       await mongoClient.close();
   }

   return "Updated Successfully";
}