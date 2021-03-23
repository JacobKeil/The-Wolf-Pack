var donateButton = document.getElementById("modal-button-donate");
var priceAmount = document.getElementById("amount");
var total = document.getElementById("total");

var getUrl = window.location;
var baseUrl = getUrl.protocol + "//" + getUrl.host;

function changeValues() {
    total.value = "$" + priceAmount.value;
}

function donateMoney() {
    if (total == "") {
        return;
    }
    const Http = new XMLHttpRequest();
    const url = `${baseUrl}/donate/${total.value.replace("$", "")}`;
    Http.open("POST", url);
    Http.send();

    setTimeout(() => {
        window.location.replace("/thankyou");
    }, 3000);
}

var stripeHandler = StripeCheckout.configure({
    key: stripePublicKey,
    locale: "auto",
    token: function (token) {
        var price = parseInt(parseFloat(total.value.replace("$", "")) * 100);
        console.log(price);

        fetch(`/donate/charge/${token.id}/${price}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        }).catch((error) => {
            console.error(error);
        });

        donateMoney();
    }
});

function donateClicked() {
    if (total == "") {
        return;
    }
    var price = parseFloat(total.value.replace("$", "")) * 100;
    stripeHandler.open({
        amount: price
    });
}

