const { Router } = require("express");
const { createOrder, getOrders } = require("../controllers/ordersController");
const router = Router();

router.route("/").post(createOrder).get(getOrders);

module.exports = router;
