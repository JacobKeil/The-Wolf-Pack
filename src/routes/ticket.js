const router = require("express").Router();

const { findOneTicket } = require("../util-functions/mongodb-functions");

router.get("/", (req, res) => {
    res.redirect("/user");
});

router.get("/:id", (req, res) => {
    findOneTicket("users", "tickets", req.params.id).then(ticket_res => {
      res.render("ticket.ejs", {
        ticket: ticket_res
      });
    }).catch(err => {
      console.log(err);
    });
});

module.exports = router;