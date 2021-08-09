let modal = document.getElementById("buy-modal-full");
let steam_input = document.getElementById("steam-input");
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