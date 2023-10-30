const { Router } = require("express");
const {
  createProduct,
  getProducts,
  deleteProduct,
} = require("../controllers/productsController");
const router = Router();

router.route("/").post(createProduct).get(getProducts);
router.route("/:productId").delete(deleteProduct);

module.exports = router;
