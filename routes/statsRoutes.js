const { Router } = require("express");
const { getStats } = require("../controllers/statsController");
const router = Router();

router.route("/").get(getStats);

module.exports = router;
