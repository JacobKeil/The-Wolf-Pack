const router = require("express").Router();
const connectEnsureLogin = require("connect-ensure-login");

const { findOneTicket } = require("../util-functions/mongodb-functions");

router.get("/", (req, res) => {
    res.redirect("/user");
});

router.get("/:id", connectEnsureLogin.ensureLoggedIn({ redirectTo: "/" }), (req, res) => {
    findOneTicket("users", "tickets", req.params.id).then(ticket_res => {
      res.render("ticket.ejs", {
        ticket: ticket_res
      });
    }).catch(err => {
      console.log(err);
    });
});

module.exports = router;