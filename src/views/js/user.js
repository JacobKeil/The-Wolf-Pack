let modal = document.getElementById("buy-modal-full");
let steam_input = document.getElementById("steam-input");

function openSteamModal(steamId) {
    if (steamId === "No Steam ID set") {
        document.getElementById("steam-title").innerHTML = `Add your Steam ID, click <a href="https://store.steampowered.com/account" target="_blank">here</a> to find it!`;
    } else {
        document.getElementById("steam-title").innerHTML = `Update your steam ID if needed, it is currently '${steamId}'`;
    }
    modal.style.display = "block";
  }
  
 async function updateSteamId() {
    await fetch(`/user?steamId=${steam_input.value}`, {
        method: "POST"
      }).then(res => {
        console.log(res);
      }).catch(err => {
        console.log(err);
      });

    modal.style.display = "none";
    window.location.replace("/store");
  }

  function closeSteamModal() {
    modal.style.display = "none";
  }