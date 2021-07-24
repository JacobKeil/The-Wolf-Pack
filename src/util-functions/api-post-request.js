const fetch = require("node-fetch");

module.exports.postSpawn = async function(api_url_base, token, gamesession, object, quantity) {
    await fetch(`${api_url_base}/v0/server/3ba3e6d8-79fe-4118-a305-c23f50baf6bf/gameLabs/spawn`, {
    method: "POST", 
    headers: {
        "Authorization": `Bearer ${token}`,
        "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify({
        gamesession_id: gamesession,
        object: object,
        quantity: quantity
    })
    }).then(res => {
        console.log(`SPAWNED: ${res}`)
    }).catch(err => {
        console.error(err);
    });
}