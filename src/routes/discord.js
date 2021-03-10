const router = require("express").Router();

router.get("/", (req, res) => {
    res.send({
        msg: "/api/discord"
    });
});

module.exports = router;