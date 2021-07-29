let sidebar = document.querySelector(".sidebar");
let closeBtn = document.querySelector("#btn");
let searchBtn = document.querySelector(".bx-search");
var donateButton = document.getElementById("modal-button-donate");
var priceAmount = document.getElementById("amount");
var total = document.getElementById("total");

var getUrl = window.location;
var baseUrl = getUrl.protocol + "//" + getUrl.host;

closeBtn.addEventListener("click", ()=>{
  sidebar.classList.toggle("open");
  menuBtnChange();//calling the function(optional)
});

searchBtn.addEventListener("click", ()=>{ // Sidebar open when you click on the search iocn
  sidebar.classList.toggle("open");
  menuBtnChange(); //calling the function(optional)
});

// following are the code to change sidebar button(optional)
function menuBtnChange() {
 if(sidebar.classList.contains("open")){
   closeBtn.classList.replace("bx-menu", "bx-menu-alt-right");//replacing the iocns class
 }else {
   closeBtn.classList.replace("bx-menu-alt-right","bx-menu");//replacing the iocns class
 }
}

function changeValues() {
    total.value = "$" + priceAmount.value;
}

function donateMoney() {
    if (total == "") {
        return;
    }
    console.log("passed stripe handler");
    const Http = new XMLHttpRequest();
    const url = `${baseUrl}/home/donate?price=${total.value.replace("$", "")}`;
    Http.open("POST", url, true);
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

        fetch(`/home/donate/charge?token_id=${token.id}&price=${price}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        }).catch((error) => {
            console.error(error);
            return;
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
