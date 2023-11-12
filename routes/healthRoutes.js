const { Router } = require("express");
const getHealth = require("../controllers/healthController");
const router = Router();

router.route("/").get(getHealth);

module.exports = router;
