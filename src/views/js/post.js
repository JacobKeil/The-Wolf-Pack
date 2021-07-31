var Channel = document.getElementById("channel");
var Title = document.getElementById("title");
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