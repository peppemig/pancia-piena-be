const { Router } = require("express");
const {
  createProduct,
  getProducts,
  deleteProduct,
  editProduct,
} = require("../controllers/productsController");
const router = Router();

router.route("/").post(createProduct).get(getProducts);
router.route("/:productId").delete(deleteProduct).put(editProduct);

module.exports = router;
