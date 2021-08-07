var Channel = document.getElementById("channel");
var Title = document.getElementById("title");
var Description = document.getElementById("description");
var postSuccess = document.getElementById("posted");
var Color = document.getElementById("colorpicker");
var Content = document.getElementById("everyone");

var User = document.getElementById("users");
var Credits = document.getElementById("credits-to-give");
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

function postEmbed() {
    fetch(`/admin/post/${Channel.value}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            content: `${(Content.checked) ? "@everyone" : ""}`,
            embed: {
                title: `${Title.value}`,
                description: `${Description.value}`,
                color: `${Color.value}`
            }
        })
    }).catch((error) => {
        console.error(error);
        return;
    });

    postSuccess.classList.remove("hidden");

    setTimeout(() => {
        postSuccess.classList.add("hidden");
    }, 10000);
}

function addCredits() {
    fetch(`/admin/user/add?discordId=${User.value}&credits=${Credits.value}`, {
        method: "POST"
    }).catch((error) => {
        console.error(error);
        return;
    });

    setTimeout(() => {
        window.location.replace("/admin");
    }, 1500);
}