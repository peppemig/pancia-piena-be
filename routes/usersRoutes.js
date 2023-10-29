const { Router } = require("express");
const { createUser } = require("../controllers/usersController");
const router = Router();

router.route("/").post(createUser);

module.exports = router;
