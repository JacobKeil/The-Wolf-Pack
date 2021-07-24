let sidebar = document.querySelector(".sidebar");
let closeBtn = document.querySelector("#btn");
let searchBtn = document.querySelector(".bx-search");

closeBtn.addEventListener("click", ()=>{
  sidebar.classList.toggle("open");
  menuBtnChange();//calling the function(optional)
});

searchBtn.addEventListener("click", ()=>{ // Sidebar open when you click on the search iocn
  sidebar.classList.toggle("open");
  menuBtnChange(); //calling the function(optional)
});

// following are the code to change sidebar button(optional)
function menuBtnChange() {
 if(sidebar.classList.contains("open")){
   closeBtn.classList.replace("bx-menu", "bx-menu-alt-right");//replacing the iocns class
 }else {
   closeBtn.classList.replace("bx-menu-alt-right","bx-menu");//replacing the iocns class
 }
}

var getUrl = window.location;
var baseUrl = getUrl.protocol + "//" + getUrl.host;

async function spawnItem(item, credits) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", `${baseUrl}/store?object=${item}&quantity=1&price=${credits}`, true);
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