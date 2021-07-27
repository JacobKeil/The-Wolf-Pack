let sidebar = document.querySelector(".sidebar");
let closeBtn = document.querySelector("#btn");
let searchBtn = document.querySelector(".bx-search");
let modal = document.getElementById("buy-modal-full");
let buy_button = document.getElementById("buy-object");
let cancel_button = document.getElementById("cancel-buy");

var getUrl = window.location;
var baseUrl = getUrl.protocol + "//" + getUrl.host;

let classItem = "";
let creds = "";

closeBtn.addEventListener("click", ()=>{
  sidebar.classList.toggle("open");
  menuBtnChange();
});

searchBtn.addEventListener("click", ()=>{
  sidebar.classList.toggle("open");
  menuBtnChange();
});

function menuBtnChange() {
 if(sidebar.classList.contains("open")){
   closeBtn.classList.replace("bx-menu", "bx-menu-alt-right");
 }else {
   closeBtn.classList.replace("bx-menu-alt-right","bx-menu");
 }
}

function openBuyModal(item, name, credits) {
  document.getElementById("buy-title").innerHTML = `Are you sure you want to purchase 1 ${name} for ${credits} credits?`;
  modal.style.display = "block";
  classItem = item;
  creds = credits;
}

function closeBuyModal() {
  modal.style.display = "none";
}

async function buyItem() {
  modal.style.display = "none";
  await spawnItem(classItem, creds);
  location.reload();
}

async function spawnItem(item, credits) {
  await fetch(`/store?object=${item}&quantity=1&price=${credits}`, {
    method: "POST"
  }).then(res => {
    console.log(res);
  }).catch(err => {
    console.log(err);
  });
}