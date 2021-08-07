let sidebar = document.querySelector(".sidebar");
let closeBtn = document.querySelector("#btn");
let searchBtn = document.querySelector(".bx-search");
var donateButton = document.getElementById("modal-button-donate");
var priceAmount = document.getElementById("amount");
var total = document.getElementById("total");
let nav_modal = document.getElementById("nav-modal-full");
let open_modal_button = document.getElementById("modal-menu-open");
let close_modal_button = document.getElementById("modal-menu-close");

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

function changeValues() {
    total.value = "$" + priceAmount.value;
}

function donateClicked(price_id) {
    fetch(`/home/donate/charge?price=${price_id}`, {
        method: "POST",
        headers: {
          "Access-Control-Allow-Origin": "*"
        }
    }).then(res => {
        console.log(res);
    }).catch(err => {
        console.log(err);
    })
}
