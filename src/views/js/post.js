var Channel = document.getElementById("channel");
var Title = document.getElementById("modal-title");
var Description = document.getElementById("description");

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

    alert("Message Posted");
}