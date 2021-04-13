var Channel = document.getElementById("channel");
var Title = document.getElementById("modal-title");
var Description = document.getElementById("description");
var postSuccess = document.getElementById("posted");

function postEmbed() {
    fetch(`/admin/post/${Channel.value}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            content: `@everyone`,
            embed: {
                title: `${Title.value}`,
                description: `${Description.value}`
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