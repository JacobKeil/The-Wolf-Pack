require("dotenv").config();
const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_DB_URL;
const mongoClient = new MongoClient(uri);

module.exports = {
    findAll: async function(db, coll) {
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
    },
    findOneDiscordId: async function(db, coll, param) {
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
    },
    addDiscordUser: async function(db, coll, discordId, steamId, user) {
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
    },
    findOneUpdateSteam: async function(db, coll, discordId, steamId, user) {
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
    },
    findOneTicket: async function(db, coll, param) {
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
    },
    findTicketsById: async function (db, coll, param) {
        let result;
        try {
            await mongoClient.connect();
            result = await mongoClient.db(`${db}`).collection(`${coll}`).find({ openedId: param }).toArray();
        } catch (e) {
            console.error(e);
        } finally {
            await mongoClient.close();
        }
        return result;
    },
    updateCurrency: async function (db, coll, param, curr) {
        try {
        await mongoClient.connect();
        await mongoClient.db(`${db}`).collection(`${coll}`).findOneAndUpdate(
            { discordId: param }, 
            { $inc: { credits: -curr } })
        } catch (e) {
            console.error(e);
        } finally {
            await mongoClient.close();
        }
        return "Updated Successfully";
    },
    addCurrency: async function (db, coll, param, curr) {
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
        return "Added Successfully";
    }
}