var getUrl = window.location;
var baseUrl = getUrl.protocol + "//" + getUrl.host;

async function spawnItem(item, credits) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", `${baseUrl}/store/${item}/1/${credits}`, true);
    xhr.send();
}

// async function spawnItem(item, credits) {
//     await fetch(`https://the-wolfpack.herokuapp.com/store?object=${item}&quantity=1&cost=${credits}`, {
//         method: "POST"
//     }).then(res => {
//         res.status(200);
//     }).catch((error) => {
//         console.error(error);
//         return;
//     });
// }