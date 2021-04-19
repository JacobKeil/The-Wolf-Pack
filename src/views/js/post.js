var Channel = document.getElementById("channel");
var Title = document.getElementById("modal-title");
var Description = document.getElementById("description");
var postSuccess = document.getElementById("posted");
var Color = document.getElementById("colorpicker");
var Content = document.getElementById("everyone");

function postEmbed() {
    fetch(`/admin/post/${Channel.value}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            content: `${(document.getElementById("everyone").checked) ? "@everyone" : ""}`,
            embed: {
                title: `${Title.value}`,
                description: `${Description.value}`,
                color: `${document.getElementById("colorpicker").value}`
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