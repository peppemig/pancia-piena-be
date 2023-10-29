const createProduct = async (req, res) => {
  try {
    console.log(req.user);
    res.status(200).json({
      success: "true",
      msg: "You can access this endpoint - CREATE PRODUCT ENDPOINT",
    });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};

const getProducts = async (req, res) => {
  try {
    console.log(req.user);
    res.status(200).json({
      success: "true",
      msg: "You can access this endpoint - GET PRODUCTS ENDPOINT",
    });
  } catch (error) {
    res.status(400).json({ success: false });
  }
};

module.exports = { createProduct, getProducts };
