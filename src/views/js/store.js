let sidebar = document.querySelector(".sidebar");
let closeBtn = document.querySelector("#btn");
let modal = document.getElementById("buy-modal-full");
let creditText = document.getElementById("creds");
let buy_button = document.getElementById("buy-object");
let cancel_button = document.getElementById("cancel-buy");
let nav_modal = document.getElementById("nav-modal-full");
let open_modal_button = document.getElementById("modal-menu-open");
let close_modal_button = document.getElementById("modal-menu-close");
let search = document.getElementById("store-search");

open_modal_button.addEventListener("click", openNavModal);
close_modal_button.addEventListener("click", closeNavModal);

function openNavModal() {
  nav_modal.style.display = "block";
}

function closeNavModal() {
  nav_modal.style.display = "none";
}

var getUrl = window.location;
var baseUrl = getUrl.protocol + "//" + getUrl.host;

let classItem = "";
let creds = "";

closeBtn.addEventListener("click", ()=>{
  sidebar.classList.toggle("open");
  menuBtnChange();
});

function goToUser() {
  window.location.replace("/user");
}

window.onload = function () {
  checkCredits();
}

function checkCredits() {
  if (accountCredits === "false") {
    document.getElementById("buy-title").innerHTML = `No Steam ID was found, please add one here!`;
    document.getElementById("buy-object").style.display = "none";
    document.getElementById("cancel-buy").style.display = "none";
    document.getElementById("continue").style.display = "none";
    document.getElementById('add-steam').style.display = "block";
    document.getElementById("buy-modal-full").style.display = "block";
  }
}

function menuBtnChange() {
 if(sidebar.classList.contains("open")){
   closeBtn.classList.replace("bx-menu", "bx-menu-alt-right");
 }else {
   closeBtn.classList.replace("bx-menu-alt-right","bx-menu");
 }
}

function openBuyModal(item, name, credits, accountCredits) {
  if(accountCredits - credits < 0) {
    document.getElementById("buy-title").innerHTML = `You do not have enough credits to purchase 1 ${name}.`;
    document.getElementById("buy-object").style.display = "none"
    document.getElementById('add-steam').style.display = "none";
    document.getElementById("cancel-buy").style.display = "none";
    document.getElementById("continue").style.display = "block";
  } else {
    document.getElementById("buy-title").innerHTML = `Are you sure you want to purchase 1 ${name} for ${credits} credits?`;
    document.getElementById("buy-object").style.display = "block"
    document.getElementById('add-steam').style.display = "none";
    document.getElementById("continue").style.display = "none";
    document.getElementById("cancel-buy").style.display = "block";
  }
  modal.style.display = "block";
  classItem = item;
  creds = credits;
}

function closeBuyModal() {
  modal.style.display = "none";
}

async function reloadPage() {
  location.reload();
}

function notInServer() {
  document.getElementById("buy-title").innerHTML = `Please join the server to use the online store!`;
  document.getElementById("buy-object").style.display = "none";
  document.getElementById("cancel-buy").style.display = "none";
  document.getElementById('add-steam').style.display = "none";
  document.getElementById("continue").style.display = "block";
  document.getElementById("buy-modal-full").style.display = "block";
}

async function buyItem() {
  modal.style.display = "none";
  await spawnItem(classItem, creds, accountCredits).then(res => {
    console.log(res);
  }).catch(err => {
    console.log(err);
  });
}

async function spawnItem(item, credits, accountCredits) {
  await fetch(`/store?object=${item}&quantity=1&price=${credits}&credits=${accountCredits}`, {
    method: "POST"
  }).then(res => {
    console.log(res);
    res.json().then(json => {
      if (json.statusServer === "user-not-in-server") {
        notInServer();
        return;
      } else {
        setTimeout(() => {
          window.location.replace("/store");
        }, 2000);
      }
    })
  }).catch(err => {
    console.log(err);
  });
}

search.onkeyup = function () {
  getSearch();
};

function getSearch() {
  let items = document.getElementsByClassName("store-item");
  for (let i = 0; i < items.length; i++) {
   if(!items[i].id.toLowerCase().includes(search.value.toLowerCase())) {
    document.getElementById(items[i].id).classList.add("hidden");
   } else {
    document.getElementById(items[i].id).classList.remove("hidden");
   }
  }
}