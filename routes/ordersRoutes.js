const { Router } = require("express");
const {
  createOrder,
  getOrders,
  deleteOrder,
  setOrderToCompleted,
  getCompletedOrdersPaginated,
} = require("../controllers/ordersController");
const router = Router();

router.route("/").post(createOrder).get(getOrders);

router.route("/completed").get(getCompletedOrdersPaginated);

router.route("/:orderId").delete(deleteOrder);

router.route("/completed/:orderId").put(setOrderToCompleted);

module.exports = router;
