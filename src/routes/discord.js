const router = require("express").Router();

router.get("/", (req, res) => {
    res.render({
        msg: "/api/discord"
    });
});

module.exports = router;