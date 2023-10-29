const { Router } = require("express");
const {
  createProduct,
  getProducts,
} = require("../controllers/productsController");
const router = Router();

router.route("/").post(createProduct).get(getProducts);

module.exports = router;
